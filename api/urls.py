from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views
from .views import get_doctors
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('forum',views.ForumViewSet, basename='forum')

urlpatterns=[
    path("token/", views.TokenPairView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
    path("register/", views.SignUpView.as_view()),
    path("register/doctor", views.SignUpDoctorView.as_view()),
    path('doctors/', get_doctors, name='get_doctors'),
    path('',include(router.urls)),


]