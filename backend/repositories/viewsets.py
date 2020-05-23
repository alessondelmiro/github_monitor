from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Commit, Repository
from .permissions import CreatePermission
from .serializers import RepositorySerializer, CommitSerializer
from .util import create_repository, check_repos, create_commit
class RepositoryViewSet(ModelViewSet):

    serializer_class = RepositorySerializer

    def list(self, request):
        queryset =  Repository.objects.filter(user=self.request.user)
        serializer = RepositorySerializer(many=True, fields=('id', 'name', 'full_name', 'description', 'commit_count'))
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Repository.objects.filter(user=self.request.user)
        repository = get_object_or_404(queryset, pk=pk)
        serializer = RepositorySerializer(repository, context={'request': request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        return create_repository(self.request, serializer)

    @action(detail=False)
    def check(self, request):
        return check_repos(request)

class CommitViewSet(ModelViewSet):
    serializer_class = CommitSerializer
    permission_classes = (CreatePermission,)

    def get_queryset(self):
        repository_id = self.request.query_params.get('repository__id', None)
        if repository_id is not None:
            return Commit.objects.all().filter(repository__user=self.request.user, repository__id=repository_id).order_by('-created')
        return Commit.objects.all().filter(repository__user=self.request.user).order_by('-created')

    def create(self, request, *args, **kwargs):
        return create_commit(request)
