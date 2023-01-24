from django.contrib import admin
from .models import Task, Column

# Register your models here.
admin.site.register(Task)
admin.site.register(Column)