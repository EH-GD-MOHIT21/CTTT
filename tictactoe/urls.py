from django.urls import path
from .views import IS_VALID_GT

urlpatterns = [
    path('is_valid_gametoken',IS_VALID_GT.as_view()),
]
