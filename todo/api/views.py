from django.utils.dateparse import parse_datetime
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.db.models import Case, When

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated

from .models import Task, Column, Profile, Table, Attachment, CheckBox, Dates

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
def columnCreate(request):
    serializer = ColumnSerializer(data=request.data)
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
def columnDelete(request, pk):
    column = Column.objects.get(id=pk)
    column.delete()

    return Response('Column succesfully deleted')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def taskList(request):
    column_id = [int(x.strip()) for x in  request.GET.get('columns', '').split(',') if x]
    columns = Column.objects.filter(id__in=column_id)
    tasks = Column.objects.none()
    for column in columns:
        tasks |= column.task_set.all().order_by('order')
    serializer = TaskSerializer(tasks, many=True)
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
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    if request.data['image'] == '':
      if task.image:
        request.data.update({"image": task.image})
      else:
        request.data.update({"image": None})
    print(request.data)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()

    return Response('Item succesfully deleted')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def taskImageUpdate(request, pk):
    task = Task.objects.get(id=pk)
    print(request.data)
    serializer = TaskImageSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def taskImageDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.image.delete(save=True)
    serializer = TaskImageSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)



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
    profiles = Profile.objects.all().order_by(Case(When(user=request.user, then=0), default=1))
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profileUpdate(request, pk):
    profile = Profile.objects.get(id=pk)
    serializer = ProfileSerializer(instance=profile, data=request.data)
    if request.data['picture'] == '':
        request.data.update({"picture": profile.picture})
    print(request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tableList(request):
    user = request.user
    tables = user.users_added.all()
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



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attachmentsList(request):
    task_id = [int(x.strip()) for x in  request.GET.get('tasks', '').split(',') if x]
    tasks = Task.objects.filter(id__in=task_id)
    files = Task.objects.none()
    for task in tasks:
        files |= task.attachment_set.all()
    serializer = AttachmentSerializer(files, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def attachmentUpload(request):
    for file in request.data.getlist('attachments'):
        print(file)
        serializer = AttachmentSerializer(data={'task':request.data['task'], 'file':file})
        if serializer.is_valid():
            serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def attachmentDelete(request, pk):
    attachment = Attachment.objects.get(id=pk)
    attachment.delete()

    return Response('File succesfully deleted')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkList(request):
    task_id = [int(x.strip()) for x in  request.GET.get('tasks', '').split(',') if x]
    tasks = Task.objects.filter(id__in=task_id)
    checkBox = Task.objects.none()
    for task in tasks:
        checkBox |= task.checkbox_set.all()
    serializer = CheckBoxSerializer(checkBox, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkBoxCreate(request):
    serializer = CheckBoxCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkBoxUpdate(request, pk):
    checkBox = CheckBox.objects.get(id=pk)
    serializer = CheckBoxUpdateSerializer(instance=checkBox, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def checkBoxDelete(request, pk):
    checkBox = CheckBox.objects.get(id=pk)
    checkBox.delete()

    return Response('CheckBox succesfully deleted')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def datesList(request):
    task_id = [int(x.strip()) for x in  request.GET.get('tasks', '').split(',') if x]
    tasks = Task.objects.filter(id__in=task_id)
    dates = Task.objects.none()
    for task in tasks:
        dates |= task.dates_set.all()
    serializer = DatesSerializer(dates, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dateCreate(request):
    serializer = DatesCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dateUpdate(request, pk):
    date = Dates.objects.get(id=pk)
    if request.data['date'] == '':
        request.data.update({"date": date.date})
    else:
        request.data.update({"date": parse_datetime(request.data['date'])})
    serializer = DatesUpdateSerializer(instance=date, data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def dateDelete(request, pk):
    date = Dates.objects.get(id=pk)
    date.delete()

    return Response('Date succesfully deleted')