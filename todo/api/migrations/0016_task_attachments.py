# Generated by Django 4.1.7 on 2023-04-17 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_task_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='attachments',
            field=models.FileField(blank=True, null=True, upload_to='files/'),
        ),
    ]
