import http
import json
import requests

from decouple import config

from .models import Repository, Commit
from .tasks import get_repo_commits, create_repo_hook

from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseNotFound

from rest_framework.exceptions import NotFound

GITHUB_URL = config("GITHUB_URL")

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

    return HttpResponse(status=http.HTTPStatus.NO_CONTENT)

def check_repos(req):
    if Repository.objects.filter(user=req.user):
        return HttpResponse(status=204)

    return HttpResponseNotFound()
