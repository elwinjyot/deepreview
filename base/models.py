from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class Student(models.Model):
    GENDER = (
        ('Male', 'Male'),
        ('Female', 'Female')
    )
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, blank=True, null=True)
    admnNo = models.IntegerField(verbose_name='Admission Number')
    name = models.CharField(max_length=100, null=False, blank=False)
    fathersName = models.CharField(max_length=100, null=False, blank=False)
    mothersName = models.CharField(max_length=100, null=False, blank=False)
    dateOfBirth = models.CharField(
        max_length=10, null=False, default="NIL", blank=True)
    aadharNumber = models.CharField(max_length=12,
                                    verbose_name='Aadhar Number', default="", null=False, blank=True)
    gender = models.CharField(
        max_length=10, choices=GENDER, null=False, blank=True)
    address = models.CharField(max_length=200, null=False, blank=True)
    feeStatus = models.TextField(
        verbose_name="Fee status in JSON format", default="{}")
    remarks = models.TextField(null=False, blank=True)
    password = models.CharField(
        max_length=8, null=False, blank=True, default="")
    marksheet = models.TextField(
        verbose_name="Marksheet as Json", blank=True, null=False, default="{}")

    def __str__(self) -> str:
        return f"{self.admnNo} | {self.name}"


class Teacher(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name='Registered User')
    assignedClass = models.CharField(max_length=5, blank=True, null=False)

    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"


class Grade(models.Model):
    className = models.CharField(
        verbose_name='Class', max_length=5, null=False, blank=True, unique=True)

    students = models.ManyToManyField(Student, blank=True)
    sub_teachers = models.ManyToManyField(Teacher, related_name='sub')
    class_teacher = models.OneToOneField(
        Teacher, related_name='main', on_delete=models.DO_NOTHING, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.className}"
