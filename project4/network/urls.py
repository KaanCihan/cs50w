
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    #API Routes
    path("posts", views.post, name="posts"),
    path("posts/<str:timeline>", views.timeline, name="timeline"), 
    path("posts/<str:user_name>/<str:followed_name>", views.follow, name="follow")
]
