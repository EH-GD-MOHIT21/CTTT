from django.http.response import Http404
from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView
from .app_utils.data_handler import *
from .app_utils.verification import Fetch_cache, set_cache,GenerateOTP,GenerateSlug
from .app_utils.mailer import SubjectAndMessageGenLogin, send_mail,SubjectAndMessageGenSignup,SubjectAndMessageGenFP,ConfirmationCPLogin, send_room_token_message
from django.contrib.auth.models import User
from django.core.cache import cache
from django.contrib.auth import authenticate,login,logout
from rest_framework.decorators import api_view
from tictactoe.models import GameManager

class SignupView(APIView):
    def post(self,request):
        data = request.data
        Required_fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_pass"
        ]
        # null check
        status,reason = IsMissingFields(data,Required_fields)
        if not status:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':reason})

        try:
            User.objects.get(username=data["email"])
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'Email already Exists.'})
        except:
            pass
        
        try:
            Fetch_cache(data["email"])
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'otp send please try after 5 minutes.'})
        except Exception as e:
            pass
        
        if not isValidName(data['first_name']) or not isValidName(data['last_name']):
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'first or last Name can be only alphabets and length should be less than 20 without any space'})

        if not isValidMail(data["email"]):
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'Invalid Mail Id.'})

        status1,reason1 = isValidPass(data['password'],data['confirm_pass'])

        if not status1:
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':reason1})

        otp = GenerateOTP()

        subject,message = SubjectAndMessageGenSignup(data["first_name"],otp)

        if send_mail(to=data["email"],subject=subject,message=message):
            set_cache(data,otp)
            return Response({'status':HTTP_200_OK,'message':'OTP send on provided mail id.'})
        else:
            return Response({'status':HTTP_500_INTERNAL_SERVER_ERROR,'message':'something went wrong.'})



class VerifyRegister(APIView):
    def post(self,request,email=None):
        data = request.data
        if email == None:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
        try:
            otp = data["otp"]
        except:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
        try:
            fetchdata = Fetch_cache(email)
            if str(fetchdata["otp"]).strip() != str(otp).strip():
                return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'Incorrect OTP.'})
            user = User(username=email)
            user.first_name = fetchdata["first_name"]
            user.last_name = fetchdata["last_name"]
            user.email = email
            user.set_password(fetchdata["password"])
            user.save()
            game = GameManager(index=user)
            token = game.Generate_Game_Token
            game.save()
            subject,message = send_room_token_message(user.first_name,token)
            send_mail(to=email,subject=subject,message=message)
            # deleting the created cache
            try:
                cache.delete_pattern(email)
            except:
                pass
            return Response({'status':HTTP_200_OK,'message':f'user registerd successfully Your game token mailed to you.'})

        except Exception as e:
            print(e)
            return Response({'status':HTTP_403_FORBIDDEN,'message':'user not exists.'})
        

class LoginApi(APIView):
    def post(self,request):
        data = request.data
        Required_fields = [
            "username",
            "password"
        ]
        # null check
        status,reason = IsMissingFields(data,Required_fields)
        if not status:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':reason})

        user = authenticate(request,username=data["username"],password=data["password"])
        if user == None:
            return Response({'status':HTTP_203_NON_AUTHORITATIVE_INFORMATION,'message':'Invalid Username or Password.'})
        try:
            Fetch_cache(data["username"])
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'otp send please try after 5 minutes.'})
        except Exception as e:
            pass
        otp = GenerateOTP()
        subject,message = SubjectAndMessageGenLogin(otp)
        if send_mail(to=user.email,subject=subject,message=message):
            cache.set(data["username"],{"username":data["username"],"password":data["password"],"otp":otp},timeout=300)
            return Response({'status':HTTP_200_OK,'message':'OTP send for verification.'})
        else:
            return Response({'status':HTTP_500_INTERNAL_SERVER_ERROR,'message':'Email Not send for verification.'})


class VerifyLogin(APIView):
    def post(self,request,email=None):
        data = request.data
        if email == None:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
        try:
            otp = data["otp"]
        except:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})

        try:
            fetchdata = Fetch_cache(email)
            if str(fetchdata["otp"]).strip() != str(otp).strip():
                return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'Invalid OTP.'})
            user = authenticate(request,username=fetchdata["username"],password=fetchdata["password"])
            if user == None:
                return Response({'status':HTTP_404_NOT_FOUND,'message':'User Not Found.'})
            login(request,user)
            try:
                cache.delete_pattern(email)
            except:
                pass
            subject,message = ConfirmationCPLogin(email,is_fp=False)
            if send_mail(to=email,subject=subject,message=message):
                return Response({'status':HTTP_200_OK,'message':'success'})
            else:
                return Response({'status':HTTP_200_OK,'message':'Login success but confirmation mail not send.'})
        except:
            return Response({'status':HTTP_403_FORBIDDEN,'message':"Can't find user please login again."})


@api_view(["GET","POST","PUT","PATCH","DELETE"])
def signout(request):
    logout(request)
    return Response({'status':HTTP_200_OK,'message':'success'})



class ForgotPassAPI(APIView):
    def post(self,request):
        data = request.data
        try:
            username = data["username"]
            try:
                user = User.objects.get(username=username)
                try:
                    Fetch_cache(username)
                    return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':'link send please try after 5 minutes.'})
                except Exception as e:
                    pass
                token = GenerateSlug()
                subject,message = SubjectAndMessageGenFP(username,token)
                if send_mail(to=username,subject=subject,message=message):
                    cache.set(username,token,timeout=300)
                    # print(token)
                    return Response({'status':HTTP_200_OK,'message':'Reset Instructions send on mail.'})
                else:
                    return Response({'status':HTTP_500_INTERNAL_SERVER_ERROR,'message':'Email Not Send server Error.'})
            except:
                return Response({'status':HTTP_404_NOT_FOUND,'message':'User Not Found.'})
        except:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})



class ValidateFPAPI(APIView):
    def post(self,request,email=None,token=None):
        if token == None or email==None:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
        data = request.data
        status,reason = IsMissingFields(data,["password","confirmpass"])
        if not status:
            return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':reason})
        try:
            status,reason = isValidPass(data["password"],data["confirmpass"])
            if not status:
                return Response({'status':HTTP_406_NOT_ACCEPTABLE,'message':reason})
            fetchdata = Fetch_cache(email)
            if str(fetchdata).strip() == str(token).strip():
                try:
                    user = User.objects.get(username=email)
                    user.set_password(data["password"])
                    user.save()
                    try:
                        cache.delete_pattern(email)
                    except:
                        pass
                    subject,message = ConfirmationCPLogin(email)
                    if send_mail(to=email,subject=subject,message=message):
                        return Response({'status':HTTP_200_OK,'message':'success'})
                    else:
                        return Response({'status':HTTP_200_OK,'message':'Login success but confirmation mail not send.'})
                except:
                    return Response({'status':HTTP_404_NOT_FOUND,'message':"Can't find user."})
            return Response({'status':HTTP_404_NOT_FOUND,'message':'Invalid Token for user.'})
        except:
            return Response({'status':HTTP_404_NOT_FOUND,'message':'User Not Found.'})



class is_auth_user(APIView):
    def get(self,request):
        return Response({'status':HTTP_200_OK,'is_auth':request.user.is_authenticated})


class is_Valid_FPRequest(APIView):
    def post(self,request):
        data = request.data
        try:
            username = data["username"]
            token = data["token"]
            try:
                ftoken = Fetch_cache(username)
                if token == ftoken:
                    return Response({'status':HTTP_200_OK,'message':'success'})
                return Response({'status':HTTP_404_NOT_FOUND,'message':'Invalid Token.'})
            except Exception as e:
                return Response({'status':HTTP_404_NOT_FOUND,'message':'USER Not Found to submit Request.'})
        except:
            return Response({'status':HTTP_400_BAD_REQUEST,'message':'Invalid Request.'})
            