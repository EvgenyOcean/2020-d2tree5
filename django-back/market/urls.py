from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='root'),
    path('requests/', views.RequestsList.as_view(), name='requests-list'),
    path('customers/', views.CustomersList.as_view(), name='customers-list'), 
    path('customers/<str:username>/', views.CustomerDetail.as_view(), name='customer-detail'), 
    path('requests/<str:slug>/', views.RequestDetail.as_view(), name='request-detail'),
]