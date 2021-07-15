# Generated by Django 3.2.5 on 2021-07-15 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_alter_grade_students'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='password',
        ),
        migrations.AlterField(
            model_name='grade',
            name='students',
            field=models.ManyToManyField(blank=True, to='base.Student'),
        ),
        migrations.AlterField(
            model_name='student',
            name='aadharNumber',
            field=models.IntegerField(blank=True, default=0, verbose_name='Aadhar Number'),
        ),
    ]
