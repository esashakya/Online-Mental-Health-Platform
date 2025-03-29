from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views
from .views import get_doctors,update_doctor,get_users,update_user,get_blogs,AddMusicView,MusicViewSet,AddMoodView,update_music, MoodViewSet,update_blog,get_preferred_doctor,get_preferred_blog,AppointmentViewSet, book_appointment, approve_appointment,get_preferred_user
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('forum',views.ForumViewSet, basename='forum')
router.register('appointments', views.AppointmentViewSet, basename='appointment')
router.register('music', views.MusicViewSet, basename='music')
router.register('mood', views.MoodViewSet, basename='mood')



urlpatterns=[
    path("token/", views.TokenPairView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
    path("register/", views.SignUpView.as_view()),
    path("register/doctor", views.SignUpDoctorView.as_view()),
    path('doctors/', get_doctors, name='get_doctors'),
    path('doctors/<int:id>', get_preferred_doctor, name='get_preferred_doctor'),
    path('blog/<int:id>', get_preferred_blog, name='get_preferred_blog'),

    path('get/user/<int:id>',get_preferred_user, name='get_preferred_user'),
    path('book/', book_appointment, name='book-appointment'),
    path('blogs/', get_blogs, name='get_blogs'),
    path('approve/', approve_appointment, name='approve-appointment'),
    path('users/', get_users, name='get_users'),
    path("admin/add", views.AddView.as_view()),
    path("blog/add", views.AddBlogView.as_view()),
    path("music/add", views.AddMusicView.as_view()),
    path("mood/add", views.AddMoodView.as_view()),

    path('update/doctors/<int:pk>', update_doctor, name='update_doctor'),
    path('users/<int:pk>', update_user, name='update_user'),
    path('blogs/<int:pk>', update_blog, name='update_blog'),
    path('musics/<int:pk>', update_music, name='update_music'),

    
    path('',include(router.urls)),


]