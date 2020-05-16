from django.db import models
from users.models import User
from datetime import datetime
from django.contrib.postgres.fields import JSONField

class Repository(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    github_id = models.IntegerField(unique=True)
    github_hook_id = models.IntegerField(unique=True, null=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True)
    url = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Commit (models.Model):

    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    sha = models.CharField(max_length=100, primary_key=True)
    url = models.CharField(max_length=255)
    created = models.DateTimeField(default=datetime.now, blank=True)
    author = JSONField()
    message = models.TextField(blank=True)