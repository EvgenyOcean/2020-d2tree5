from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser, Customer


class SignUpSerializer(serializers.ModelSerializer):
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

    def validate(self, data):
        if not any([data.get('is_executor'), data.get('is_customer')]):
            raise serializers.ValidationError('User must be either an executor or a customer')
        return data
        
    def create(self, validated_data):
        if validated_data.get('is_executor'):
            user = CustomUser.objects.create_user(email=validated_data['email'], username=validated_data['username'],
                password=validated_data['password'], is_executor=True)
        elif validated_data.get('is_customer'):
            user = CustomUser.objects.create_user(email=validated_data['email'], username=validated_data['username'],
                password=validated_data['password'], is_customer=True)

        return user

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'is_executor', 'is_customer']
        extra_fields = {
            'is_executor': {'write_only': True},
            'is_customer': {'write_only': True}
        }


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


class CustomerSerliazer(serializers.HyperlinkedModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    requests = serializers.HyperlinkedRelatedField(
        view_name='request-detail',
        many=True,
        read_only=True
    )

    class Meta:
        model = CustomUser
        fields = ['username', 'requests']