from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Column(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Task(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False, blank=True, null=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title