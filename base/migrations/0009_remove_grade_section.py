# Generated by Django 3.2.5 on 2021-07-07 15:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_auto_20210707_1545'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grade',
            name='section',
        ),
    ]
