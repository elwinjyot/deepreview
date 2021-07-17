from django.shortcuts import render
from .models import *
from base.models import *
import json
# Create your views here.


def studentDetail(request):
    admnNo = request.user.student.admnNo
    student = Student.objects.get(admnNo=admnNo)
    grade = student.grade_set.all()[0]
    className = grade.className
    feeInfo = json.loads(student.feeStatus)
    with open("./marksheet.json", 'r') as file:
        data = json.load(file)
        try:
            studentMarksheet = data[className][str(admnNo)]
        except:
            studentMarksheet = None
        file.close()
    context = {
        'student': request.user.student,
        'marksheet': studentMarksheet,
        'feeInfo': feeInfo,
        'sub_list': ["G.K", "V.Ed", "Dance", "Music", "HPE", "Computer"]
    }
    return render(request=request, template_name='Parents/studDetail.html', context=context)
