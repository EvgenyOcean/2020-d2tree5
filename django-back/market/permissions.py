from django.contrib.auth.models import Group
from .models import Position, Request
from rest_framework.permissions import BasePermission


class OnlyExecutors(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_staff:
            return True
        executor_group = Group.objects.get(name='executors')
        return user in executor_group.user_set.all()


class OnlyRequestOwnerOrExecutor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        executor_group = Group.objects.get(name='executors')

        if user.is_staff:
            return True

        if user in executor_group.user_set.all():
            return True
        
        if isinstance(obj, Request):
            return obj.owner == user
        elif isinstance(obj, Position):
            return obj.request.owner == user
        else:
            return False
 

class OnlyConcreteCustomerOrExecutor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        executor_group = Group.objects.get(name='executors')

        if user.is_staff:
            return True

        if user in executor_group.user_set.all():
            return True
    
        return obj.owner.user == self.user
