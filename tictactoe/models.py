from django.db import models
from django.contrib.auth.models import User
from random import choice
# Create your models here.


class GameManager(models.Model):
    index = models.OneToOneField(User,on_delete=models.CASCADE)
    gametoken = models.CharField(max_length=100,unique=True)
    active_members = models.IntegerField(default=0)
    Game_users = models.TextField(null=True,blank=True)


    @property
    def Generate_Game_Token(self):
        valid_ucs = [chr(i) for i in range(65,91)] + [chr(i) for i in range(97,123)] + [str(i) for i in range(0,10)]
        token = ''
        for i in range(70):
            token += choice(valid_ucs)
        value = GameManager.objects.all().count()
        token += str(value)
        self.gametoken = token
        return token