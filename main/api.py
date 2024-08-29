from django.forms import model_to_dict
from rest_framework import generics
from rest_framework.response import Response

from main.serializers import EmailSerializer, LetterSerializer
from main.models import Email, Letter


class GetEmails(generics.ListAPIView):
    queryset = Email.objects.all()
    http_method_names = ["get"]
    serializer_class = EmailSerializer


class GetLetters(generics.ListAPIView):
    queryset = Letter.objects.all()
    http_method_names = ["get"]
    serializer_class = LetterSerializer

    def get(self, *args, **kwargs):
        serializer = LetterSerializer(data=model_to_dict(Letter.objects.get(pk=1)))
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=200)
