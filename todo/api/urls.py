from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('users/', views.userList, name='user-list'),

    path('profiles/', views.profileList, name='profile-list'),

    path('', views.apiOverview, name='api-overview'),
    path('task-list/', views.taskList, name='task-list'),
    path('task-detail/<str:pk>/', views.taskDetail, name='task-detail'),
    path('task-create/', views.taskCreate, name='task-create'),
    path('task-update/<str:pk>', views.taskUpdate, name='task-update'),
    path('task-delete/<str:pk>', views.taskDelete, name='task-delete'),

    path('column-list/', views.columnList, name='column-list'),
    path('column-create/', views.columnCreate, name='column-create'),
    path('column-update/<str:pk>', views.columnUpdate, name='column-update'),
    path('column-delete/<str:pk>', views.columnDelete, name='column-delete'),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.userCreate, name='user-create'),
]