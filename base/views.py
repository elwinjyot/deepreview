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
    students = grade.students.all()

    context = {
        'grade': gradeId,
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
    with open("./marksheet.json", 'r') as file:
        data = json.load(file)
        try:
            studentMarksheet = data[className][id]
        except:
            studentMarksheet = None
        file.close()

    context = {
        'class': className,
        'student': student,
        'marksheet': studentMarksheet,
        'feeInfo': feeInfo,
        'grade': gradeId
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
                username = "".join(name.split())
                password = ""
                for i in range(0, 4):
                    password += random.choice(alpha_list)
                password += data["admnNo"]
                user = User.objects.create_user(
                    username=username, password=password)
                student = Student.objects.create(user=user, password=password, admnNo=data['admnNo'], name=data['name'],
                                                 fathersName=data['fatherName'], mothersName=data['motherName'], dateOfBirth=data['dob'], aadharNumber=data['adNo'], gender=data['gender'], address=data['address'], remarks=data['remarks'], feeStatus=json.dumps(feeFormat))
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
        index = int(request.POST["index"])
        grade = request.POST["grade"]
        admnNo = request.POST["admnNo"]
        with open("./marksheet.json", "r") as file:
            data = json.load(file)
            file.close()

        data[grade][admnNo][index]["RELEASED"] = state

        with open("./marksheet.json", "w") as file:
            json.dump(data, file, indent=2)
            file.close()

    return JsonResponse(True, safe=False)


def addMarksheet(request):
    if request.is_ajax and request.method == 'POST':
        with open("./marksheet.json", "r") as file:
            data = json.load(file)
            file.close()
        grade = request.POST.get('grade')
        admnNo = request.POST.get('admnNo')
        subject = json.loads(request.POST.get('subject'))
        index = request.POST.get('index')
        head = request.POST.get('head')
        testFormat = request.POST.get('format')
        try:
            test_list = data[grade][admnNo]
        except KeyError:
            data[grade][admnNo] = []
        finally:
            listStruct = data[grade][admnNo]
            listStruct.append({
                "INDEX": index,
                "HEAD": head,
                "FORMAT": testFormat,
                "RELEASED": False,
                "BODY": subject
            })
        try:
            with open("./marksheet.json", "w") as file:
                json.dump(data, file, indent=2)
                file.close()
        except:
            raise Exception("Oopsie")

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
# Errors


def error403(request, exception):
    return render(request=request, template_name="Errors/403.html")
