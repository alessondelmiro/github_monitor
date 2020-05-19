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

    def get_queryset(self):
        repository_id = self.request.query_params.get('repository__id', None)
        if repository_id is not None:
            return Commit.objects.all().filter(repository__user=self.request.user, repository__id=repository_id).order_by('-created')
        return Commit.objects.all().filter(repository__user=self.request.user).order_by('-created')
