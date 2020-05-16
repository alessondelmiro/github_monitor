web: gunicorn github_monit.wsgi --chdir backend --limit-request-line 8188 --log-file -
worker: celery worker --workdir backend --app=github_monit -B --loglevel=info
