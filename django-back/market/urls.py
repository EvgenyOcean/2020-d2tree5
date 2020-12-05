from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='root'),
    path('requests/', views.RequestList.as_view(), name='requests-list'),
    path('customers/', views.CustomersList.as_view(), name='customers-list'), 
    path('requests/<int:pk>/positions/', views.RequestDetail.as_view(), name='request-detail'),
]