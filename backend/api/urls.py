from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('transactions/', views.transactions),
    path('analytics/', views.analytics),
    path('recommendations/', views.recommendations),
    path('chat/', views.chat),
    path('loans/', views.loan_requests),
]
