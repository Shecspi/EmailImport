from django.contrib import admin
from django.urls import path

from main import views, api

urlpatterns = [
    path("", views.index),
    path("api/emails/", api.GetEmails.as_view()),
    path("api/letters/", api.GetLetters.as_view()),
    path("admin/", admin.site.urls),
]
