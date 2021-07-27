from django.urls import path
from .views import *

urlpatterns = [
    path('selectClass/', view=classSelect, name='select'),
    path('class/<str:gradeId>/', view=home, name="Home"),
    path('<str:gradeId>/profile/<str:id>/',
         view=studentDetailView, name='Detail'),
    path('addStudent/<str:gradeId>/', view=addStudent, name="AddStudent"),
    path('changeFeeState/<str:id>/', view=changeFeeState, name="ChangeFeeState"),
    path('toggleRelease/', view=toggleRelease, name="toggleRelease"),
    path('addMarksheet/', view=addMarksheet, name="addMarksheet"),
    path('deleteStud/', view=deleteStud, name="deleteStud"),
    path('deleteMarksheet/', view=deleteMarksheet, name="deleteMarksheet"),
    path('editStudent/<str:admno>/', view=editStudent, name="editStudent"),
]
