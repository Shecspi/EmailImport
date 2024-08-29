from rest_framework import serializers

from main.models import Email, Letter


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = ["email"]


class LetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Letter
        fields = "__all__"
