from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from api import views
urlpatterns=[
    path("token/", views.TokenPairView.as_view()),

    path("token/refresh/",TokenRefreshView.as_view()),
    path("register/", views.SignUpView.as_view()),
    path("register/doctor", views.SignUpDoctorView.as_view()),

]