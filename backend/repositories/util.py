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

GITHUB_REPO_URL = config("GITHUB_REPO_URL")

def create_repository(req, serializer):
    request = requests.get(
        GITHUB_REPO_URL + f'/{serializer.validated_data["name"]}',
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

        return repository

    raise NotFound(
        detail="Repository doesn't exist or you don't have permission",
        code=http.HTTPStatus.NOT_FOUND
    )

def get_repo_commits(repository_id):
    try:
        repository = Repository.objects.select_related().get(id=repository_id)
    except ObjectDoesNotExist:
        return

    since = (datetime.date.today() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')

    request = requests.get(
        GITHUB_REPO_URL + f'/{repository.full_name}/commits?since={since}',
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
