from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK,HTTP_400_BAD_REQUEST,HTTP_403_FORBIDDEN, HTTP_406_NOT_ACCEPTABLE
from .models import GameManager

class IS_VALID_GT(APIView):
    def post(self,request):
        if not request.user.is_authenticated:
            return Response({'status':HTTP_403_FORBIDDEN,'message':'User Not Authenticated.'})
        try:
            game_token = request.data["token"]
        except:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
        try:
            model = GameManager.objects.get(gametoken=game_token)
            return Response({'status':HTTP_200_OK,'message':'success'})
        except:
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'Invalid Game Token'})