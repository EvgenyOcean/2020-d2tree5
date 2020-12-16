import datetime
from django.db.models import Max, Q, F
from django.shortcuts import render
from users.models import CustomUser, Customer, Executor
from users.serializers import (CustomersListSerializer, CustomerDetailSerializer,
                            ExecutorDetailSerializer, ExecutorsListSerializer)
from market.models import Request, Position, Payment, ChangeHistory
from market.serializers import (RequestSerializer, PositionSerializer, 
                                OfferSerializer, ChangeHistorySerializer)

from rest_framework.generics import (ListAPIView, RetrieveAPIView, GenericAPIView,
                                    CreateAPIView)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .permissions import (OnlyExecutors, OnlyRequestOwnerOrExecutor, OnlyCustomers,
                          OnlyConcreteCustomerOrExecutor, OnlyConcreteExecutor)

# Create your views here.
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'customers': reverse('customers-list', request=request, format=format),
        'executors': reverse('executors-list', request=request, format=format),
        'requests': reverse('requests-list', request=request, format=format),
    })


class CustomerDetail(RetrieveAPIView):
    queryset = Customer.objects.filter(user__is_customer=True)
    serializer_class = CustomerDetailSerializer
    permission_classes = [IsAuthenticated, OnlyConcreteCustomerOrExecutor]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'


class CustomersList(ListAPIView):
    queryset = Customer.objects.filter(user__is_customer=True)
    serializer_class = CustomersListSerializer
    permission_classes = [IsAuthenticated, OnlyExecutors]


class ExecutorDetail(RetrieveAPIView):
    queryset = Executor.objects.filter(user__is_executor=True)
    serializer_class = ExecutorDetailSerializer
    permission_classes = [IsAuthenticated, OnlyConcreteExecutor]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'


class ExecutorsList(ListAPIView):
    queryset = Executor.objects.filter(user__is_executor=True)
    serializer_class = ExecutorsListSerializer
    permission_classes = [IsAdminUser]


class RequestDetail(RetrieveAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated, OnlyRequestOwnerOrExecutor]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

    def get_queryset(self):
        username = self.kwargs.get('username')
        if not username:
            return Request.objects.none()
        else:
            return Request.objects.filter(owner__user__username=username)


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


class RequestCreate(CreateAPIView):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    permission_classes = [IsAuthenticated, OnlyCustomers]

    def perform_create(self, serializer):
        try:
            # you also wanna check if deadline is legit
            deadline = datetime.datetime.fromisoformat(self.request.data.get('deadline'))
        except ValueError as err:
            raise ValidationError(str(err))
        serializer.save(owner=self.request.user.customer, deadline=deadline)


class PositionCreate(GenericAPIView):
    serializer_class = PositionSerializer
    queryset = Position.objects.all()
    permission_classes = [IsAuthenticated, OnlyCustomers]

    def post(self, http_request, **kwargs):
        data = http_request.data
        try:
            request = Request.objects.get(id=data['request_id'])
        except Exception as err:
            return Response({'message': 'Request id has not been provided or incorrect!'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not http_request.user.customer == request.owner:
            return Response({"message": "Not Authorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            position = serializer.save(request=request)
            s_position = self.get_serializer(position)
            return Response(s_position.data, status=status.HTTP_201_CREATED)


class OfferCreate(CreateAPIView):
    serializer_class = OfferSerializer
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated, OnlyExecutors]

    def perform_create(self, serializer):
        data = self.request.data
        try:
            position = Position.objects.get(id=data['position_id'])
        except (KeyError, Position.DoesNotExist):
            raise ValidationError('Position is missing or incorrect!')

        serializer.save(executor=self.request.user.executor, position=position)


class OfferUpdate(GenericAPIView):
    serializer_class = ChangeHistorySerializer
    queryset = ChangeHistory.objects.all()
    permission_classes = [IsAuthenticated, OnlyCustomers]

    def put(self, *args, **kwargs):
        customer = self.request.user.customer
        data = self.request.data
        try:
            payment = Payment.objects.get(id=data['payment_id'])
        except Exception as err:
            return Response({'message': 'Offer has not been provided or incorrect!'}, status=status.HTTP_400_BAD_REQUEST)

        print(payment.position.request.owner, customer)
        if payment.position.request.owner != customer:
            return Response(status=status.HTTP_403_FORBIDDEN)

        new_stage = ''
        if data.get('stage') == 'Assigned':
            # TODO: can only one offer be accepted at a time?
            # totally depends on business logic
            payment.is_accepted = True
            payment.save()

        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save(executor=payment.executor, position=payment.position)
            return Response(status=status.HTTP_201_CREATED)