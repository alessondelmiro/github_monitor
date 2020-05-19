from .models import Repository
from rest_framework.serializers import ModelSerializer, StringRelatedField, PrimaryKeyRelatedField

from .models import Commit, Repository

class CommitSerializer(ModelSerializer):

    repository_name = StringRelatedField(source='repository', read_only=True)
    repository_id = PrimaryKeyRelatedField(source='repository', read_only=True)

    class Meta:
        model = Commit
        fields = (
            'sha', 'url', 'author', 'message', 'created',
            'repository_name', 'repository_id'
        )
        read_only_fields = ('sha', 'url', 'author',)

class RepositorySerializer(ModelSerializer):

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'full_name', 'description', 'commit_count',
        )
        read_only_fields = ('id', 'fullname', 'description', 'commit_count',)
