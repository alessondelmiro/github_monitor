from rest_framework.serializers import ModelSerializer
from .models import User
from django.core.paginator import Paginator

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'avatar',
        )
        read_only_fields = ('id', 'email', 'username', 'avatar',)
