from rest_framework import serializers
from rest_framework.reverse import reverse
from market.models import Request


class CustomerHyperlink(serializers.HyperlinkedIdentityField):
    def get_url(self, obj, view_name, request, format):
        url_kwargs = {
            'username': obj.user.username
        }
        return reverse(view_name, kwargs=url_kwargs, request=request, format=format)

    def get_object(self, view_name, view_args, view_kwargs):
        lookup_kwargs = {
           'username': view_kwargs['username'],
        }
        return self.get_queryset().get(**lookup_kwargs)


class RequestHyperlink(serializers.HyperlinkedRelatedField):
    view_name = 'request-detail'
    queryset = Request.objects.all()

    def get_url(self, obj, view_name, request, format):
        url_kwargs = {
            'slug': obj.slug,
            'username': obj.owner.user.username
        }
        return reverse(view_name, kwargs=url_kwargs, request=request, format=format)

    def get_object(self, view_name, view_args, view_kwargs):
        lookup_kwargs = {
           'slug': view_kwargs['slug'],
           'username': view_kwargs['username']
        }
        return self.get_queryset().get(**lookup_kwargs)