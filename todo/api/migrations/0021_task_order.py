# Generated by Django 4.1.7 on 2023-05-02 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_task_members'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='order',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
