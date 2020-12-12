from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .serializers import (MyAuthTokenSerializer, SignUpSerializer)

# Create your views here.
class UserSignUp(APIView):
    """ 
    Registration endpoint
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = {"message": f"{user.username} was successfully created!"}
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    '''
    Login endpoint
    '''
    serializer_class = MyAuthTokenSerializer
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'role': 'admin' if user.is_staff else 'executors' if user.is_executor else 'customers'
        })


class Logout(APIView):
    '''
    Logout endpoint
    '''
    authentication_classes = [TokenAuthentication]

    def post(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)