from django.core import management

from github_monit.celery import app


@app.task
def clearsessions():
    management.call_command('clearsessions')
