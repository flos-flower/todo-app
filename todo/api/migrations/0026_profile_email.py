# Generated by Django 4.1.7 on 2023-05-08 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_rename_phone_profile_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='email',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
