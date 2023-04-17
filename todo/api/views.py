from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import TaskSerializer, UserSerializer, ColumnSerializer, ProfileSerializer, TableSerializer
from rest_framework.permissions import IsAuthenticated

from .models import Task, Column, Profile, Table

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List':'/task-list/',
        'Detail View':'/task-detail/<str:pk>/',
        'Create':'/task-create/',
        'Update':'/task-update/<str:pk>/',
        'Delete':'/task-delete/<str:pk>/',
    }

    return Response(api_urls)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def taskList(request):
    column_id = [int(x.strip()) for x in  request.GET.get('columns', '').split(',') if x]
    columns = Column.objects.filter(id__in=column_id)
    tasks = Column.objects.none()
    for column in columns:
        tasks |= column.task_set.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def columnList(request):
    table_id = [int(x.strip()) for x in  request.GET.get('tables', '').split(',') if x]
    tables = Table.objects.filter(id__in=table_id)
    columns = Table.objects.none()
    for table in tables:
        columns |= table.column_set.all()
    serializer = ColumnSerializer(columns, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def columnCreate(request):
    serializer = ColumnSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def taskUpdate(request, pk):
    print(request.data)
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if request.data['attachments'] == '':
        request.data.update({"attachments": task.attachments})

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def columnUpdate(request, pk):
    column = Column.objects.get(id=pk)
    serializer = ColumnSerializer(instance=column, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()

    return Response('Item succesfully deleted')

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def columnDelete(request, pk):
    column = Column.objects.get(id=pk)
    column.delete()

    return Response('Column succesfully deleted')

@api_view(['GET'])
def userList(request):
    User = get_user_model()
    users = User.objects.all()  
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def userCreate(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    profiles = Profile.objects.filter(user=request.user)
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profileUpdate(request, pk):
    profile = Profile.objects.get(id=pk)
    serializer = ProfileSerializer(instance=profile, data=request.data)
    if request.data['picture'] == '':
        request.data.update({"picture": profile.picture})
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tableList(request):
    user = request.user
    tables = user.table_set.all() | user.users_added.all()
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tableCreate(request):
    serializer = TableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tableUpdate(request, pk):
    table = Table.objects.get(id=pk)
    serializer = TableSerializer(instance=table, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def tableDelete(request, pk):
    table = Table.objects.get(id=pk)
    table.delete()

    return Response('Table succesfully deleted')