from django.contrib import admin
from .models import Task, Column, Profile, Table, Attachment

# Register your models here.
admin.site.register(Task)
admin.site.register(Column)
admin.site.register(Profile)
admin.site.register(Table)
admin.site.register(Attachment)