# Generated by Django 3.2.5 on 2021-07-15 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_student_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grade',
            name='students',
            field=models.ManyToManyField(blank=True, null=True, to='base.Student'),
        ),
    ]
