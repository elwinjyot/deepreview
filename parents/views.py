from django.shortcuts import render
from .models import *
from base.models import *
import json
# Create your views here.


def studentDetail(request):
    admnNo = request.user.student.admnNo
    student = Student.objects.get(admnNo=admnNo)
    feeInfo = json.loads(student.feeStatus)
    studentMarksheet = json.loads(student.marksheet)
    print(studentMarksheet)
    context = {
        'student': request.user.student,
        'marksheet': studentMarksheet,
        'feeInfo': feeInfo,
        'sub_list': ["G.K", "V.Ed", "Dance", "Music", "HPE", "Computer"]
    }
    return render(request=request, template_name='Parents/studDetail.html', context=context)
