# Generated by Django 3.2.5 on 2021-07-07 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_auto_20210707_1029'),
    ]

    operations = [
        migrations.AddField(
            model_name='grade',
            name='teachers',
            field=models.ManyToManyField(to='base.Teacher'),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='assignedClass',
            field=models.CharField(blank=True, max_length=5),
        ),
    ]
