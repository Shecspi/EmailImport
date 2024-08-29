from django.db import models


# Create your models here.
class Email(models.Model):
    email = models.CharField(max_length=256, null=False, blank=False)
    password = models.CharField(null=False, blank=False)

    def __str__(self):
        return self.email
