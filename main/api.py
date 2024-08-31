from rest_framework import generics

from main.serializers import EmailSerializer
from main.models import Email


class GetEmails(generics.ListAPIView):
    queryset = Email.objects.all()
    http_method_names = ["get"]
    serializer_class = EmailSerializer
