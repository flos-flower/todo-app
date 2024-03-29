# Generated by Django 4.1.7 on 2023-05-12 16:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_alter_profile_picture_alter_task_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckBox',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('complition', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, null=True)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.task')),
            ],
        ),
    ]
