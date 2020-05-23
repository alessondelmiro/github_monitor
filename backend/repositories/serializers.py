from rest_framework.serializers import ModelSerializer, StringRelatedField, PrimaryKeyRelatedField, SerializerMethodField
from common.serializers import DynamicFieldsModelSerializer
from .models import Commit, Repository
from django.core.paginator import Paginator

from rest_framework.pagination import PageNumberPagination

class CommitSerializer(ModelSerializer):

    repository_name = StringRelatedField(source='repository', read_only=True)
    repository_id = PrimaryKeyRelatedField(source='repository', read_only=True)

    class Meta:
        model = Commit
        fields = (
            'sha', 'url', 'author', 'message', 'created',
            'repository_name', 'repository_id',
        )
        read_only_fields = ('sha', 'url', 'author',)

class RelationPaginator(PageNumberPagination):
    def get_paginated_response(self, data):
        return {
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data
        }


class RepositorySerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'full_name', 'description', 'commit_count', 'commit_set', 'github_hook_id'
        )
        read_only_fields = ('id', 'fullname', 'description', 'commit_count', 'commit_set', 'github_hook_id')

    commit_set = SerializerMethodField()
    def get_commit_set(self, obj):
        queryset = obj.commit_set.all()

        request = self.context.get('request')

        serializer = CommitSerializer(
            queryset, many=True,
            context={'request': request})

        paginator = RelationPaginator()

        paginated_data = paginator.paginate_queryset(
            queryset=serializer.data, request=request)

        result = paginator.get_paginated_response(paginated_data)

        return result

