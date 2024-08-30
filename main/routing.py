from django.urls import path

from main.consumers import LetterConsumer

ws_urlpatterns = [
    path("ws/letters", LetterConsumer.as_asgi()),
]
