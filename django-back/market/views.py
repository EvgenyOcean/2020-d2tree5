from collections import defaultdict 

from django.db.models import Max, Q, F
from django.shortcuts import render
from users.models import CustomUser, Customer
from users.serializers import CustomerSerliazer, CustomerDetailSerializer
from market.models import Request, Position
from market.serializers import RequestSerializer, PositionSerializer

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated

from .permissions import (OnlyExecutors, OnlyRequestOwnerOrExecutor,
                          OnlyConcreteCustomerOrExecutor)

# Create your views here.
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'customers': reverse('customers-list', request=request, format=format),
        'requests': reverse('requests-list', request=request, format=format),
    })


class CustomerDetail(RetrieveAPIView):
    queryset = CustomUser.objects.filter(is_customer=True)
    serializer_class = CustomerDetailSerializer
    permission_classes = [IsAuthenticated, OnlyConcreteCustomerOrExecutor]
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class CustomersList(ListAPIView):
    queryset = CustomUser.objects.filter(is_customer=True)
    serializer_class = CustomerSerliazer
    permission_classes = [IsAuthenticated, OnlyExecutors]


class RequestDetail(RetrieveAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated, OnlyRequestOwnerOrExecutor]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class RequestList(ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated, OnlyExecutors]

    def get_queryset(self):
        status = self.request.GET.get('status')

        if not status:
            return Position.objects.all()

        # filtering to get the last history change; and its stage 
        # should be exactly what user passed through the url kwarg 'status'
        return Position.objects.annotate(last_date_created=Max('changes__date_created')) \
                .filter(
                    Q(changes__date_created=F('last_date_created')) &
                    Q(changes__stage=status)
                )

    def list(self, request, *args, **kwargs):
        new_data = defaultdict(list)
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        
        # changing final representation, to make request name stand out
        for o_dict in serializer.data:
            new_data[o_dict.pop('request')].append(o_dict)

        return Response(new_data)

