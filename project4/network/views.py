from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required 
from django.core.paginator import Paginator
import math

from .models import *


def index(request):
    return render(request, "network/index.html")

@csrf_exempt
@login_required
def post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)

    if data == "":
        return JsonResponse({
            "error": "Empty body"
        }, status=400)

    body = data.get("body", "")
    postt = Post(
        user=request.user,
        poster=request.user,
        body=body
    )
    postt.save()

    return JsonResponse({"message" : "Post posted successfully"}, status=201)

@login_required
def timeline(request, timeline):
    if timeline == "following":
        user_following = UserFollowing.objects.filter(user_id=request.user)
        followed_usernames = [uf.followed_user_id.username for uf in user_following]
  
        posts = Post.objects.filter(user__username__in=followed_usernames)
    elif timeline == "allposts":
        posts = Post.objects.all()
    elif User.objects.filter(username=timeline).exists():
        user = User.objects.get(username=timeline)
        posts = Post.objects.filter(poster=user)
    else:
        return JsonResponse({"error": "Invalid choice."}, status=400)
    
    if (timeline in ["allposts", "following"]):
        posts = posts.order_by("?")
    else:
        posts = posts.order_by('-timestamp')
    
    posts_data = [post.serialize() for post in posts]
    user_info = str(request.user)

    
    response_data = {
        "postArray": posts_data,
        "user": user_info, 
    }

    return JsonResponse(response_data, safe=False)

@login_required
def follow(request, user_name, followed_name):
    if request.method == "PUT":
        follower = User.objects.get(username=request.user)
        followed = User.objects.get(username=followed_name)

        #Checks if there is already a relationship  
        if UserFollowing.objects.filter(user_id=follower, followed_user_id=followed):
            #unfollow
            UserFollowing.objects.get(user_id=follower, followed_user_id=followed).delete()
        else:
            #follow
            UserFollowing(user_id=follower, followed_user_id=followed).save()
        return HttpResponse(status=204)
    elif request.method == "GET":
        follower = User.objects.get(username=request.user)
        followed = User.objects.get(username=followed_name)
        
        relationship = UserFollowing.objects.filter(user_id=follower, followed_user_id=followed).exists()
        return JsonResponse({"relationship": relationship})   
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

def likes(request, user_name, liked_post):
    post = get_object_or_404(Post, id=liked_post)
    if request.method == "POST":
        if post.likes.filter(username=request.user):
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
           
    liked_or_not = post.likes.filter(username=request.user).exists()
    like_count = post.like_count()
    response_data = {
        "liked_or_not": liked_or_not,
        "like_count": like_count,
    }
    return JsonResponse(response_data, safe=False)

def update_post(request, post_id):
    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
    
    data = json.loads(request.body)

    if data == "":
        return JsonResponse({
        "error": "Empty body"
    }, status=400)

    body = data.get("body", "")
    if not body:
        return JsonResponse({
            "error": "Empty field."
        }, status=400)

    postt = Post.objects.get(id=post_id)
    postt.body = body
    postt.save()
    return JsonResponse({"message" : "Post updated successfully"}, status=201)

        

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
