# Generated by Django 3.2.5 on 2021-07-07 15:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_grade_classname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grade',
            name='teachers',
        ),
        migrations.AddField(
            model_name='grade',
            name='class_teacher',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='main', to='base.teacher'),
        ),
        migrations.AddField(
            model_name='grade',
            name='sub_teachers',
            field=models.ManyToManyField(related_name='sub', to='base.Teacher'),
        ),
    ]