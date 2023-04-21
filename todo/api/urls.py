from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('users/', views.userList, name='user-list'),

    path('profile/', views.getProfile, name='get-profile'),
    path('profile-update/<str:pk>', views.profileUpdate, name='profile-update'),

    path('', views.apiOverview, name='api-overview'),
    path('task-list/', views.taskList, name='task-list'),
    path('task-create/', views.taskCreate, name='task-create'),
    path('task-update/<str:pk>', views.taskUpdate, name='task-update'),
    path('task-delete/<str:pk>', views.taskDelete, name='task-delete'),

    path('attachment-upload', views.attachmentUpload, name='attachment-upload'),
    path('attachments-list/', views.attachmentsList, name='attachments-list'),
    path('attachment-delete/<str:pk>', views.attachmentDelete, name='attachment-delete'),

    path('table-list/', views.tableList, name='table-list'),
    path('table-create/', views.tableCreate, name='table-create'),
    path('table-update/<str:pk>', views.tableUpdate, name='table-update'),
    path('table-delete/<str:pk>', views.tableDelete, name='table-delete'),

    path('column-list/', views.columnList, name='column-list'),
    path('column-create/', views.columnCreate, name='column-create'),
    path('column-update/<str:pk>', views.columnUpdate, name='column-update'),
    path('column-delete/<str:pk>', views.columnDelete, name='column-delete'),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.userCreate, name='user-create'),
]