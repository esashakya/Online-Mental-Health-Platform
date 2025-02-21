from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views
from .views import DoctorView

router = DefaultRouter()
router.register(r'all/registered/doctors', DoctorView, basename='doctor')

urlpatterns=[
    path("token/", views.TokenPairView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
    path("register/", views.SignUpView.as_view()),
    path("register/doctor", views.SignUpDoctorView.as_view()),
    path("", include(router.urls)),


]