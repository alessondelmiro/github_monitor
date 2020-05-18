from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Commit, Repository
from .permissions import CreatePermission
from .serializers import RepositorySerializer, CommitSerializer
from .util import create_repository, check_repos

class RepositoryViewSet(ModelViewSet):

    serializer_class = RepositorySerializer
    def get_queryset(self):
        return Repository.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return create_repository(self.request, serializer)

    @action(detail=False)
    def check(self, request):
        return check_repos(request)

class CommitViewSet(ModelViewSet):
    serializer_class = CommitSerializer
    permission_classes = (CreatePermission,)
    filter_fields = ['repository', 'repository__id']

    def get_queryset(self):
        return Commit.objects.all().filter(repository__user=self.request.user)

    # def create(self, request, *args, **kwargs):
    #     return create_commit(request)
