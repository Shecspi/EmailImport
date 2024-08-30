from django.db import models


class Email(models.Model):
    email = models.CharField(max_length=256, null=False, blank=False)
    password = models.CharField(null=False, blank=False)

    def __str__(self):
        return self.email


class Letter(models.Model):
    email = models.ForeignKey(Email, on_delete=models.CASCADE, null=False, blank=False)
    uid = models.IntegerField(null=False, blank=False)
    subject = models.CharField()
    message = models.CharField()
    date_of_send = models.DateTimeField()
    date_of_receive = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

    class Meta:
        unique_together = ("uid", "email")
