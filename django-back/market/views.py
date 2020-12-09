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


class RequestsList(ListAPIView):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated, OnlyExecutors]

    def get_queryset(self):
        status = self.request.GET.get('status')

        if not status:
            return Request.objects.all()

        # if request doesn't have a single position which would have 
        # last history stage as user specified by ?status=Created
        # then this request must not be shown
        filtered_positions =  Position.objects.annotate(last_date_created=Max('changes__date_created')) \
                .filter(
                    Q(changes__date_created=F('last_date_created')) &
                    Q(changes__stage=status)
                )

        return Request.objects.filter(positions__in=filtered_positions).distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        
        # final filtering to prevent displaying positions 
        # that have status different from the one that user specified
        stage = request.GET.get('status')
        if stage:
            for user_request in serializer.data:
                user_request['positions'] = [position for position in user_request['positions'] if position['stage'] == stage]

        return Response(serializer.data)

