from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('teach/', include('base.urls'), name='teach'),
    path('parent/', include('parents.urls'), name='parent'),
    path('', view=loginUser, name='Login'),
    path('logout/', view=logoutUser, name='Logout')
]


# Custom Error Pages
handler403 = 'base.views.error403'
