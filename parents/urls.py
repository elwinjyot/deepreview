from django.urls import path
from .views import *

urlpatterns = [
    path('details/', view=studentDetail, name='detail')
]
