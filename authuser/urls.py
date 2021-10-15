from django.urls import path
from .views import ForgotPassAPI, LoginApi, SignupView, ValidateFPAPI, VerifyLogin,VerifyRegister, is_Valid_FPRequest, is_auth_user, signout

urlpatterns = [
    path('signup',SignupView.as_view()),
    path('signup/verify/user=<email>',VerifyRegister.as_view()),
    path('login',LoginApi.as_view()),
    path('login/verify/user=<email>',VerifyLogin.as_view()),
    path('logoutuser',signout),
    path('forgotpass',ForgotPassAPI.as_view()),
    path('forgotpass/user=<email>/token=<token>',ValidateFPAPI.as_view()),
    path('is_auth',is_auth_user.as_view()),
    path('isExistsFPR',is_Valid_FPRequest.as_view()),
]
