from django.http import Http404

from rest_framework.permissions import BasePermission, IsAuthenticated


class CheckPermission(BasePermission):
    def has_permission(self, request, view):
        if IsAuthenticated.has_permission(self, request, view):
            return True

        raise Http404

class CreatePermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return True

        return CheckPermission.has_permission(self, request, view)
