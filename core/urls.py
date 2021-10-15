from django.contrib import admin
from django.urls import path,include,re_path
from django.views.generic import TemplateView
from django.conf.urls import url
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('tictactoe.urls')),
    path('auth/',include('authuser.urls')),
]

urlpatterns += [url(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT})]
urlpatterns += [url(r'^public/(?P<path>.*)$', serve,{'document_root': settings.SECOND_STATIC})]
urlpatterns += [re_path(r'^.*',TemplateView.as_view(template_name='index.html'))]