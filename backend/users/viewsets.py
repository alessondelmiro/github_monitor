from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .models import User

from .util import github_callback, verify_token

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()

    def get_permissions(self):
        permission_classes = (IsAuthenticated,) if self.action == "get_commits" else (AllowAny,)
        return [permission() for permission in permission_classes]

    @action(detail=False)
    def callback(self, request):
        return github_callback(request)

    @action(detail=False)
    def verify(self, request):
        return verify_token(request)
