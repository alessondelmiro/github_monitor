from django.conf.urls import include, url  # noqa
from django.urls import path, re_path
from django.contrib import admin
from django.shortcuts import redirect
from django.views.generic import TemplateView
import django_js_reverse.views


urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='app/home.html'), name='home'),
    path('login', TemplateView.as_view(template_name='app/home.html'), name='login'),

    path("admin/", admin.site.urls, name="admin"),

    # path('api/', include('repositories.urls')),
    path('api/', include('users.urls')),
    path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
]
