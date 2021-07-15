from django.shortcuts import redirect, render
from django.contrib.auth import login, logout, authenticate
import random
from django.http import JsonResponse


def loginUser(request):
    if request.user.is_authenticated:
        if not request.user.is_staff:
            return redirect('parent/details/')
        else:
            return redirect('select')
    else:
        if request.is_ajax and request.method == 'POST':
            userData = request.POST
            user = authenticate(
                username=userData["username"], password=userData["password"])
            if user is not None:
                login(request, user)
                return JsonResponse(request.user.is_staff, safe=False)
            else:
                raise Exception('User not found!')
            return JsonResponse(userData, safe=False)

    quotes = ["Try Ctrl + C and Ctrl + V, it's easier"]
    context = {
        'tip': random.choice(quotes)
    }
    return render(request=request, template_name='Auth/login.html', context=context)


def logoutUser(request):
    logout(request=request)
    return redirect('Login')
