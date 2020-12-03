from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser


class UserRegisterSerializer(serializers.ModelSerializer):
    '''
    Validates user model fields. 
    If everything is correct, saves the user and returns current user object
    '''
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    username = serializers.CharField(
        max_length=32,
        required=True,
        validators=[
            UniqueValidator(queryset=CustomUser.objects.all())
        ]
    )
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(validated_data['email'], validated_data['username'],
             validated_data['password'])
        return user

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password')


class MyAuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField(
        label=_("email"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs