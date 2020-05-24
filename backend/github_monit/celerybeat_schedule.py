from celery.schedules import crontab


CELERYBEAT_SCHEDULE = {
    # Internal tasks
    "clearsessions": {"schedule": crontab(hour=3, minute=0), "task": "users.tasks.clearsessions"},
    "createhooks": {"schedule": crontab(minute='*/15'), "task": "repositories.tasks.createhooks"},
}
