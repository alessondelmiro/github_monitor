# Generated by Django 2.2.12 on 2020-05-14 03:24

import datetime
from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Repository',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('github_id', models.IntegerField(unique=True)),
                ('github_hook_id', models.IntegerField(null=True, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255, null=True)),
                ('url', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Commit',
            fields=[
                ('sha', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('url', models.CharField(max_length=255)),
                ('created', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('author', django.contrib.postgres.fields.jsonb.JSONField()),
                ('message', models.TextField(blank=True)),
                ('repository', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='repositories.Repository')),
            ],
        ),
    ]
