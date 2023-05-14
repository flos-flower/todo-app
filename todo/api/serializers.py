from rest_framework import serializers
from .models import Task, Column, Profile, Table, Attachment, CheckBox
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['image']

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class CheckBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckBox
        fields = '__all__'

class CheckBoxUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckBox
        fields = ['description', 'complition']

class CheckBoxCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckBox
        fields = ['description', 'task']

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')