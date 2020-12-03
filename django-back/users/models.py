from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, 
                    BaseUserManager, PermissionsMixin)
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **other_fields):
        if not email:
            raise ValueError("Email is required!")

        if not username:
            raise ValueError("Username is required!")

        user = self.model(
            email=self.normalize_email(email), 
            username=username,
            **other_fields,
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, username, password=None, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)

        user = self.create_user(
            email=email, 
            username=username,
            password=password, 
            **other_fields,
        )

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom User Model itself"""
    email = models.EmailField(max_length=254, unique=True)
    username = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    about = models.TextField()
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_executor = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class Customer(models.Model):
    '''
    if in the future we need to add some properties associated with customers
    this will be a good place
    '''
    user = models.OneToOneField(CustomUser, related_name='customer', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username}\'s customer profile'


class Executor(models.Model):
    user = models.OneToOneField(CustomUser, related_name='executor', on_delete=models.CASCADE)
    offers = models.ManyToManyField('market.Position', related_name='executors', through='market.Payment')

    def __str__(self):
        return f'{self.user.username}\'s executor profile'