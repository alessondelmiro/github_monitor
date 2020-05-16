from django.conf.urls import include
from django.urls import path

from rest_framework import routers

from .viewsets import UserViewSet


ROUTER = routers.DefaultRouter()
ROUTER.register(r'', UserViewSet, basename='User')

urlpatterns = (
    path('', include(ROUTER.urls)),
)
