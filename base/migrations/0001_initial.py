# Generated by Django 3.2.5 on 2021-07-03 06:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('className', models.IntegerField(blank=True, verbose_name='Class')),
                ('section', models.CharField(blank=True, max_length=1, verbose_name='Section')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('fathersName', models.CharField(max_length=100)),
                ('mothersName', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignedClass', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='base.grade', verbose_name='Asssigned Class')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Registered User')),
            ],
        ),
        migrations.AddField(
            model_name='grade',
            name='students',
            field=models.ManyToManyField(to='base.Student'),
        ),
    ]
