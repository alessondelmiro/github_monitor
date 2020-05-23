import requests
from decouple import config
import re
import http
import json

from .models import Repository, Commit
from django.template import loader
from django.http import HttpResponse, HttpResponseNotFound
from django.db import IntegrityError
from rest_framework.exceptions import NotFound
from django.core.exceptions import ObjectDoesNotExist
import datetime
from github_monit.celery import app
from requests.exceptions import RequestException

GITHUB_URL = config("GITHUB_URL")
APP_URL = config("APP_URL")

def create_repository(req, serializer):
    request = requests.get(
        GITHUB_URL + f'/repos/{serializer.validated_data["name"]}',
        headers={
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': f'token {req.user.github_token}',
        },
    )
    if request.status_code == http.HTTPStatus.OK:
        json_data = json.loads(request.text)
        serializer.validated_data["github_id"] = json_data["id"]
        serializer.validated_data["name"] = json_data["name"]
        serializer.validated_data["description"] = json_data["description"]
        serializer.validated_data["url"] = json_data["html_url"]

        try:
            repository = serializer.save(user=req.user)
        except IntegrityError:
            raise NotFound(
                detail="Sorry, this repository has already been added",
                code=http.HTTPStatus.UNPROCESSABLE_ENTITY
            )

        get_repo_commits(repository.id)
        create_repo_hook.delay(repository.id)

        return repository

    raise NotFound(
        detail="Repository doesn't exist or you don't have permission",
        code=http.HTTPStatus.NOT_FOUND
    )

def create_commit(request):
    payload = request.POST.dict().get('payload', None)

    if not payload:
        return HttpResponse(status=http.HTTPStatus.UNPROCESSABLE_ENTITY)

    payload = json.loads(payload)

    commits = payload.get('commits', None)
    repository = payload.get('repository', None)

    if not (commits and repository):
        return HttpResponse(status=http.HTTPStatus.UNPROCESSABLE_ENTITY)

    try:
        repository = Repository.objects.get(github_id=repository['id'])
    except Repository.DoesNotExist:
        return HttpResponse(status=http.HTTPStatus.NOT_FOUND)

    for commit in commits:
        if Commit.objects.filter(sha=commit['id']).exists():
            continue
        try:
            commit = Commit(
                sha=commit['id'],
                url=commit['url'],
                author=commit['author'],
                created=commit['timestamp'],
                message=commit.get('message', None),
                repository=repository,
            )
            commit.save()

        except IntegrityError:
            return HttpResponse(status=http.HTTPStatus.UNPROCESSABLE_ENTITY)

    webhook_data = {
            'data': {
                'sha': commit.sha,
                'url': commit.url,
                'created': commit.created,
                'author': commit.author,
                'message': commit.message,
            }
    }

    requests.post(url=APP_URL + f'/commit_hook', data=webhook_data)

    return HttpResponse(status=http.HTTPStatus.NO_CONTENT)

def get_repo_commits(repository_id):
    try:
        repository = Repository.objects.select_related().get(id=repository_id)
    except ObjectDoesNotExist:
        return

    since = (datetime.date.today() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')

    request = requests.get(
        GITHUB_URL + f'/repos/{repository.full_name}/commits?since={since}',
        headers={
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': f'token {repository.user.github_token}',
        },
    )
    if request.status_code == http.HTTPStatus.OK:
        json_data = json.loads(request.text)
        for item in json_data:
            try:
                commit = Commit.objects.create(
                    repository = repository,
                    sha = item["sha"],
                    url = item["html_url"],
                    created = item["commit"]["committer"]["date"],
                    author = item["commit"]["author"],
                    message = item["commit"]["message"],
                )
            except (TypeError, IntegrityError):
                pass

def check_repos(req):
    if Repository.objects.filter(user=req.user):
        return HttpResponse(status=204)

    return HttpResponseNotFound()

def commit_hook_check(req):
    print(req)
    return HttpResponse(status=204)

@app.task(autoretry_for=(RequestException,), default_retry_delay=15 * 60,
          retry_kwargs={'max_retries': 4})
def create_repo_hook(repository_id):
    try:
        repository = Repository.objects.select_related().get(id=repository_id)
    except ObjectDoesNotExist:
        return

    request = requests.post(
        f'https://api.github.com/repos/{repository.full_name}/hooks',
        headers={
            'Authorization': f'token {repository.user.github_token}',
            'Accept': 'application/vnd.github.v3+json'
        },
        json={
            'name': 'web',
            'events': [
                'push'
            ],
            'config': {
                'url': f'{APP_URL}/commits/'
            }
        }
    )

    if request.status_code == http.HTTPStatus.FORBIDDEN:
        return

    if request.status_code != http.HTTPStatus.CREATED:
        raise RequestException

    json_data = json.loads(request.text)
    Repository.objects.filter(id=repository_id).update(github_hook_id=json_data['id'])
