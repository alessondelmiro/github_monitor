import http
import json
import requests
import datetime

from decouple import config

from github_monit.celery import app
from .models import Repository, Commit

from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist

from requests.exceptions import RequestException
import logging

GITHUB_URL = config("GITHUB_URL")
APP_URL = config("APP_URL")

@app.task(autoretry_for=(RequestException,), default_retry_delay=15 * 60,
          retry_kwargs={'max_retries': 4})
def create_repo_hook(repository_id):
    try:
        repository = Repository.objects.select_related().get(id=repository_id)
    except ObjectDoesNotExist:
        return

    request = requests.post(
        GITHUB_URL + f'/repos/{repository.full_name}/hooks',
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
                'url': f'{APP_URL}/api/commits/'
            }
        }
    )

    if request.status_code == http.HTTPStatus.FORBIDDEN:
        return

    if request.status_code != http.HTTPStatus.CREATED:
        raise RequestException

    json_data = json.loads(request.text)
    Repository.objects.filter(id=repository_id).update(github_hook_id=json_data['id'])

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

@app.task
def createhooks():
    repositories = Repository.objects.filter(github_hook_id__isnull=True)
    if repositories.count() > 0:
        for repository in repositories:
            create_repo_hook.delay(repository.id)

    return
