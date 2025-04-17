from django.db import models
import string 
import secrets

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.utils import timezone
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
    status = [
        (1,"Working"),
        (2,"On leave")
    ]
    doctor_photo = models.ImageField(upload_to="Doctors/", default="Doctors/default.png")
    doctor_type = models.IntegerField(choices=doctor_role, default=1)
    doctor_experience = models.IntegerField(default=1)
    doctor_status = models.IntegerField(choices=status, default =1)

    doctor_degree = models.TextField(max_length=250)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctorDetails")

class DoctorWorkingTime(models.Model):
    doctor_id = models.ForeignKey("Doctor", on_delete=models.CASCADE, related_name="time_slots")
    start_time = models.TimeField()
    end_time = models.TimeField()

class Appointment(models.Model):
    options = [
        (1, "Completed"),
        (2, "Pending"),
        (3, "Not attended"),
        (4, "Approved"),
        (5, "Confirmed")
    ]

    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userAppointments')
    therapist_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctorAppointments')
    appointment_date = models.DateTimeField(default=timezone.now)
    appointment_status = models.IntegerField(choices=options, default=2)
    code = models.CharField(max_length=8, unique=True, blank=True, null=True) 

    def save(self, *args, **kwargs):
        
        if not self.code:
            self.code = self.generate_random_code()
        super(Appointment, self).save(*args, **kwargs)

    def generate_random_code(self):
        characters = string.ascii_letters + string.digits
        code = ''.join(secrets.choice(characters) for i in range(8))   
        return code


class Review(models.Model):
    review_date = models.DateField(auto_now_add= True)
    review_post = models.TextField(max_length=500)
    doctor_ratings = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], default=1)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userReview') #user foreign key
    therapist_id = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctorReview') #doctor foreign key

    def clean(self):
        if len(self.review_post)<10:
            raise ValidationError("Error: Review must be longer than 10 characters.")
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
        ("Chill","Chill"),
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

class Comment(models.Model):
    comment_type =[
        ("Forum","Forum"),
        ("Blog","Blog"),
        
    ]
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='blog_comments', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    anonymous = models.BooleanField(default=False)
    comment_category = models.CharField(
        max_length=5,
        choices=comment_type,
        default="Forum"
    ) 
    class Meta:
        ordering = ['created_at']  

