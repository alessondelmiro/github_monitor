from .models import Repository
from rest_framework.serializers import ModelSerializer, StringRelatedField, PrimaryKeyRelatedField, SerializerMethodField
from common.serializers import DynamicFieldsModelSerializer
from .models import Commit, Repository
from django.core.paginator import Paginator

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

class RepositorySerializer(DynamicFieldsModelSerializer):

    commit_set = SerializerMethodField('paginated_commitinrepository')
    class Meta:
        model = Repository
        fields = (
            'id', 'name', 'full_name', 'description', 'commit_count', 'commit_set',
        )
        read_only_fields = ('id', 'fullname', 'description', 'commit_count', 'commit_set')

    def paginated_commitinrepository(self, obj):
        commits = Commit.objects.filter(repository=obj).order_by('-created')
        page_size = self.context['request'].query_params.get('size', None) or 10
        paginator = Paginator(commits, page_size)
        page = self.context['request'].query_params.get('page', None) or 1

        commits_in_repository = paginator.page(page)
        serializer = CommitSerializer(commits_in_repository, many=True)
        return serializer.data

