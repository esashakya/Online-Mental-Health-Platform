from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views
from .views import get_doctors,update_doctor,get_users,update_user,get_blogs,AddMusicView,MusicViewSet,CommentViewSet,AddMoodView,update_music, MoodViewSet,update_blog,get_preferred_doctor,get_preferred_blog,AppointmentViewSet, book_appointment, approve_appointment,get_preferred_user, update_delete_review
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('forum',views.ForumViewSet, basename='forum')
router.register('appointments', views.AppointmentViewSet, basename='appointment')
router.register('music', views.MusicViewSet, basename='music')
router.register('mood', views.MoodViewSet, basename='mood')
router.register('comments', CommentViewSet, basename='comments')


urlpatterns=[
    path("token/", views.TokenPairView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
    path("register/", views.SignUpView.as_view()),
    path("register/doctor", views.SignUpDoctorView.as_view()),
    path('doctors/', get_doctors, name='get_doctors'),
    path('top-forums/', views.top_forum_posts_by_comments, name='top-forums'),
    path('doctors/<int:id>', get_preferred_doctor, name='get_preferred_doctor'),
    path('doctor-status-summary/', views.doctor_status_summary, name='doctor-status-summary'),
    path('blog/<int:id>', get_preferred_blog, name='get_preferred_blog'),
    path('appointments/check_availability/', views.check_appointment_availability, name='check-availability'),
    path('get/user/<int:id>',get_preferred_user, name='get_preferred_user'),
    path('book/', book_appointment, name='book-appointment'),
    path('blogs/', get_blogs, name='get_blogs'),
    path('approve/', approve_appointment, name='approve-appointment'),
    path('users/', get_users, name='get_users'),
    path("admin/add", views.AddView.as_view()),
    path("blog/add", views.AddBlogView.as_view()),
    path("music/add", views.AddMusicView.as_view()),
    path("mood/add", views.AddMoodView.as_view()),
    path("make/payment", views.make_payment),
    path("mood/create", views.add_mood),
    path("get/reviews/", views.get_reviews),
    path('reviews/<int:pk>/', update_delete_review, name='update-delete-review'),
    path('admin/delete/review/<int:pk>/', views.admin_delete_review, name='admin_delete_review'),


    path("add/reviews/", views.create_review),
    path('update/doctors/<int:pk>', update_doctor, name='update_doctor'),
    path('users/<int:pk>', update_user, name='update_user'),
    path('blogs/<int:pk>', update_blog, name='update_blog'),
    path('musics/<int:pk>', update_music, name='update_music'),

    
    path('',include(router.urls)),


]