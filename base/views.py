import json
from os import stat
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import *
from django.contrib.auth.decorators import login_required
import random
import string
from .decorators import allowed_users
# Create your views here.


@login_required(login_url='/')
@allowed_users(allowed_roles=["staff"])
def home(request, gradeId):
    grade = Grade.objects.get(id=gradeId)
    students = grade.students.all().order_by('name')

    context = {
        'grade': gradeId,
        'className': grade.className,
        'students': students,
        'strength': len(students),
        'admin': grade.class_teacher
    }
    return render(request=request, template_name='home.html', context=context)


@allowed_users(allowed_roles=["staff"])
def studentDetailView(request, gradeId, id):
    student = Student.objects.get(admnNo=id)
    grade = Grade.objects.get(id=gradeId)
    className = grade.className
    feeInfo = json.loads(student.feeStatus)
    # Get students Marksheet
    studentMarksheet = json.loads(student.marksheet)
    print(studentMarksheet)
    context = {
        'class': className,
        'student': student,
        'marksheet': studentMarksheet,
        'feeInfo': feeInfo,
        'grade': gradeId,
        'sub_list': ["G.K", "V.Ed", "Dance", "Music", "HPE", "Computer"]
    }
    return render(request=request, template_name='detail.html', context=context)

# Extra


@allowed_users(allowed_roles=["staff"])
def classSelect(request):
    grades = Grade.objects.all()
    gradeList = []
    for grade in grades:
        if request.user.teacher in grade.sub_teachers.all():
            gradeList.append(grade)

    context = {
        'grades': gradeList
    }
    return render(request=request, template_name='classSel.html', context=context)


@allowed_users(allowed_roles=["staff"])
def changeFeeState(request, id):
    if request.is_ajax and request.method == 'POST':
        student = Student.objects.get(admnNo=id)
        data = json.loads(student.feeStatus)
        index = int(request.POST["body[id]"])
        currState = data[index]["PAID"]
        data[index]["PAID"] = not currState
        data = json.dumps(data)
        student.feeStatus = str(data)
        student.save()

    return JsonResponse(data, safe=False)


@allowed_users(allowed_roles=["staff"])
def addStudent(request, gradeId):
    if request.is_ajax and request.method == 'POST':
        try:
            data = json.loads(request.POST['body'])
            alpha_list = list(string.ascii_lowercase)
            with open("./feeFormat.json", "r") as file:
                feeFormat = json.load(file)
                file.close
            try:
                name = data["name"].lower()
                username = "".join(name.split()) + \
                    str(random.choice(range(1, 10))) + \
                    str(random.choice(range(1, 10)))
                password = ""
                for i in range(0, 4):
                    password += random.choice(alpha_list)
                password += data["admnNo"]
                user = User.objects.create_user(
                    username=username, password=password)
                student = Student.objects.create(user=user, password=password, admnNo=data['admnNo'], name=data['name'],
                                                 fathersName=data['fatherName'], mothersName=data['motherName'], dateOfBirth=data['dob'], aadharNumber=data['adNo'], gender=data['gender'], address=data['address'], remarks=data['remarks'], feeStatus=json.dumps(feeFormat), marksheet="[]")
                grade = Grade.objects.get(id=gradeId)
                grade.students.add(student)
                grade.save()
                return JsonResponse({"username": username, "password": password}, safe=True)
            except Exception as e:
                raise Exception(
                    'Something went wrong please try again later', e)
        except Exception as e:
            raise Exception(e)
    return JsonResponse(True, safe=False)


def toggleRelease(request):
    if request.is_ajax and request.method == 'POST':
        state = json.loads(request.POST["state"])
        index = request.POST["index"]
        admnNo = request.POST["admnNo"]
        student = Student.objects.get(admnNo=admnNo)
        marksheet = json.loads(student.marksheet)
        for i in marksheet:
            if i["INDEX"] == index:
                i["RELEASED"] = state

        student.marksheet = json.dumps(marksheet)
        student.save()

    return JsonResponse(True, safe=False)


def addMarksheet(request):
    if request.is_ajax and request.method == 'POST':
        admnNo = request.POST.get('admnNo')
        student = Student.objects.get(admnNo=int(admnNo))
        subject = json.loads(request.POST.get('subject'))
        index = request.POST.get('index')
        head = request.POST.get('head')
        testFormat = request.POST.get('format')
        marksheetData = json.loads(student.marksheet)
        marksheetData.append({
            "INDEX": index,
            "HEAD": head,
            "FORMAT": testFormat,
            "RELEASED": False,
            "BODY": subject
        })
        student.marksheet = json.dumps(marksheetData)
        student.save()

    return JsonResponse(True, safe=False)


def deleteStud(request):
    if request.is_ajax and request.method == 'POST':
        admnNo = request.POST.get('admnNo')
        student = Student.objects.get(admnNo=admnNo)
        try:
            user = User.objects.get(id=student.user.id)
            user.delete()
        except Exception as e:
            raise Exception("Something went wrong", e)

    return JsonResponse(True, safe=False)


def deleteMarksheet(request):
    if request.is_ajax and request.method == 'POST':
        student = Student.objects.get(admnNo=request.POST.get('admnNo'))
        marksheet = json.loads(student.marksheet)
        for i in marksheet:
            if i["INDEX"] == request.POST.get('index'):
                marksheet.remove(i)
        student.marksheet = json.dumps(marksheet)
        student.save()
        return JsonResponse(True, safe=False)

# Errors


def error403(request, exception):
    return render(request=request, template_name="Errors/403.html")
