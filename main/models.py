from django.db import models


class Email(models.Model):
    email = models.CharField(max_length=256, null=False, blank=False)
    password = models.CharField(null=False, blank=False)

    def __str__(self):
        return self.email


class Letter(models.Model):
    email = models.ForeignKey(Email, on_delete=models.CASCADE)
    topic = models.CharField(null=False, blank=False)
    message = models.CharField(null=False, blank=False)
    date_of_send = models.DateTimeField()
    date_of_receive = models.DateTimeField()
    files = models.CharField(null=True, blank=True)

    def __str__(self):
        return self.topic
