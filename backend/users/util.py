import requests
from decouple import config
import re
import http
import json

from .models import User
from django.template import loader
from rest_framework.exceptions import NotFound
from django.http import HttpResponse, HttpResponseNotFound
from .serializers import UserSerializer
from rest_framework.response import Response

GITHUB_CLIENT_ID = config("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = config("GITHUB_CLIENT_SECRET")
GITHUB_ACCESS_URL = config("GITHUB_ACCESS_URL")
GITHUB_USER_URL = config("GITHUB_USER_URL")

def github_callback(req):
    code = req.GET.get('code', None)
    if code:
        request = requests.post(
            GITHUB_ACCESS_URL,
            data={
                'client_id': GITHUB_CLIENT_ID,
                'client_secret': GITHUB_CLIENT_SECRET,
                'code': code,
            },
        )
        token = re.findall(r'^access_token=(\w+)', request.text)
        if token:
            token = token[0]
            request = requests.get(
                GITHUB_USER_URL,
                headers={
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': f'token {token}',
                },
            )
            if request.status_code == http.HTTPStatus.OK:
                json_data = json.loads(request.text)
                try:
                    user = User.objects.get(github_id=json_data['id'])
                    user.email = json_data['email']
                    user.username = json_data['login']
                    user.avatar = json_data['avatar_url']
                    user.github_token = token
                    user.save()
                except User.DoesNotExist:
                    user = User.objects.create_user(
                        json_data['email'],
                        github_id=json_data['id'],
                        username=json_data['login'],
                        avatar=json_data['avatar_url'],
                        github_token=token,
                    )

                template = loader.get_template('../templates/app/home.html')
                context = {
                    'token': token,
                }
                return HttpResponse(template.render(context, req))

    return HttpResponseNotFound()

def verify_token(req):
    token = req.GET.get('token', None)
    if token:
        try:
            request = requests.get(
                GITHUB_USER_URL,
                headers={
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': f'token {token}',
                },
            )
            if request.status_code == http.HTTPStatus.OK:
                json_data = json.loads(request.text)
                user = User.objects.get(github_id=json_data['id'])
                user.email = json_data['email']
                user.username = json_data['login']
                user.avatar = json_data['avatar_url']
                user.save()
                serializer = UserSerializer(user)
        except User.DoesNotExist:
            raise NotFound(
            detail="User not found",
            code=http.HTTPStatus.NOT_FOUND
        )

    return Response(serializer.data)
