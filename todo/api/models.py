from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='images/', default='images/default.jpg')
    name = models.CharField(max_length=200, null=True, blank=True)
    surname = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.user) + '_profile'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Table(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Column(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    table = models.ForeignKey(Table, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)

    def __str__(self):
        return self.title