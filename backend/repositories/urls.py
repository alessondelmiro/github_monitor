from django.conf.urls import include
from django.urls import path

from rest_framework import routers

from .viewsets import CommitViewSet, RepositoryViewSet


ROUTER = routers.DefaultRouter()
ROUTER.register(r'repositories', RepositoryViewSet, basename='Repository')
ROUTER.register(r'commits', CommitViewSet, basename='Commit')

urlpatterns = [
    path('', include(ROUTER.urls)),
]
