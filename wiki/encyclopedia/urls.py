from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("createpage", views.create_page, name="create_page"),
    path("randompage", views.random_page, name="random_page"),
    path("wiki/<str:title>", views.wiki_page, name="wiki_page"),
    path("wiki/edit/<str:title>", views.edit_page, name="edit_page")
]

