from django.core import management

from github_monit.celery import celery_app


@app.task
def clearsessions():
    management.call_command('clearsessions')
