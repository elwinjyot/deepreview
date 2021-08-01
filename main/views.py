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

    quotes = ["Grapes light on fire in the microwave", "McDonald's once created bubblegum-flavoured broccoli", "The average mammal takes 21 seconds to empty it's bladder", "Chewing gum is banned in Singapore", "Lobster have clear blood", "The first item sold on eBay was a broken laser pointer", "Japan is suffering from ninja shortage", "The longest place name in the world is 85 letters long", "Bubble wrap was originally invented as wallpaper", "Shakespeare invented more than 1,700 words", "Santa Claus was given an official pilot's license in 1927", "Einstein's brain was stolen when he died", "Antarctica is covered in a sheet of ice that's 7,000 feet thick!", "There's a Guinness World Record for the stretchiest skin", "A lifeboat drill was cancelled the morning of the Titanic tragedy", "There's a Starbucks cup in every shot in the movie Fight Club", "Lady Liberty wears a size 879 shoe!", "There's a planet that's shaped like a potato", '"Strengths" is the longest word in the English language with one vowel', "It would cost $18.3 million to make a replica Darth Vader suit"]
    context = {
        'tip': random.choice(quotes)
    }
    return render(request=request, template_name='Auth/login.html', context=context)


def logoutUser(request):
    logout(request=request)
    return redirect('Login')
