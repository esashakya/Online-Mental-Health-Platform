from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
# Create your models here.

class User(AbstractUser):
    gender_options = [
        (1, "Male"),
        (2, "Female"),
        (3, "Other"),
    ]
    roles = [
        (1,"Normal User"),
        (2,"Admin"),
        (3,"Doctor"),
    ]
    
    user_fullname = models.CharField(max_length=100)
    user_email = models.EmailField(unique= True, max_length=100)
    user_gender = models.IntegerField(choices=gender_options, default=1)
    user_role = models.IntegerField(choices=roles,default=1)

    #changing the columns name 
    username = None
    email = None

    USERNAME_FIELD = "user_email"
    REQUIRED_FIELDS = ["user_fullname"]
class Doctor(models.Model):
    doctor_role = [
        (1, "Therapist"),
        (2, "Psychiatrist"),
    ]
    doctor_photo = models.ImageField(upload_to="Doctors/", default="Doctors/default.png")
    doctor_type = models.IntegerField(choices=doctor_role, default=1)
    doctor_availableTime = models.TimeField()
    doctor_degree = models.TextField(max_length=250)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctorDetails")

class Appointment(models.Model):
    options=[
        (1,"In Call"),
        (2,"Pending"),
        (3,"Not attended"),
    ]
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userAppointments')
    therapist_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctorAppointments')
    appointment_date = models.DateTimeField(auto_now_add=True)
    appointment_status = models.IntegerField(choices=options, default=2)

class Review(models.Model):
    review_date = models.DateField(auto_now_add= True)
    review_post = models.TextField(max_length=500)
    doctor_ratings = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], default=1)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userReview') #user foreign key
    therapist_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctorReview') #doctor foreign key

    def clean(self):
        if len(self.review_post)<10:
            raise ValidationError("Review must be longer than 10 characters")
    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)
class Blog(models.Model):
    options=[
        ("Anxiety","Anxiety"),
        ("Depression","Depression"),
        ("OCD","OCD"),
        ("Sleep Paralysis", "Sleep Paralysis")
    ]
    blog_image = models.ImageField(upload_to="Blogs/", default="Blogs/default.png")
    blog_title = models.CharField(max_length=100, unique=True)
    blog_detail = models.TextField(max_length=5000)
    blog_date = models.DateField(auto_now_add=True)
    blog_category = models.TextField(choices=options, default="Anxiety")
    therapist_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='blog') #doctor foreign key
   

class Forum(models.Model):
    post_title = models.CharField(max_length=100)
    post_detail = models.TextField(max_length=5000)
    post_date = models.DateField(auto_now_add=True)
    anonymous = models.BooleanField(default=True, blank=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userForum') #user foreign key
    def clean(self):
        if len(self.post_detail)<10:
            raise ValidationError("Forum post must be longer than 10 characters")
    # def save(self,*args,**kwargs):
    #     self.full_clean()
    #     super().save(*args,**kwargs)
class Mood(models.Model):
    mood_options=[
        ("Sad","Sad"),
        ("Happy","Happy"),
        ("Anxious","Anxious"),
        ("Sleepy","Sleepy"),
        ("Panic","Panic"),
        ("Neutral","Neutral"),
    ]
    type_mood = models.CharField(max_length=11,choices=mood_options, default="Neutral")
    mood_date = models.DateField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userMood') #user foreign key

class Music(models.Model):
    music_options =[
        ("Anxiety","Anxiety"),
        ("Insomonia","Insomonia"),
        ("Panic","Panic"),
    ]
    music = models.CharField(max_length=1000)
    type_music = models.CharField(max_length=25,choices=music_options, default="Panic")
    mood_id = models.ForeignKey(Mood, on_delete=models.CASCADE, related_name='moodMusic') #mood foreign key

    

