from api.models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from datetime import date, timedelta

from rest_framework.validators import UniqueValidator
from rest_framework.fields import SerializerMethodField
class UserSerializer(serializers.ModelSerializer): #serialize to json format
    password = serializers.CharField(
        write_only= True, 
        required=True,
        validators=[validate_password]
    )
    retype_password = serializers.CharField(write_only= True, 
        required=True)
    class Meta:
        model = User #user class that needs to be serialized
        fields = ['id','user_fullname','user_email','user_gender','user_role','password','retype_password']
    def create(self,validated_data):
        validated_data.pop('retype_password')
        user = User.objects.create(
            user_fullname = validated_data['user_fullname'],
            user_email = validated_data['user_email'],

        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class DoctorTimeSlotSerializer(serializers.ModelSerializer):
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), write_only=True)

    class Meta:
        model = DoctorWorkingTime
        fields = ["id", "doctor_id", "start_time", "end_time"]

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    doctor_photo = serializers.ImageField(required=False)
    time_slots = DoctorTimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'doctor_photo', 'doctor_type', 'doctor_status', 'doctor_degree', 'time_slots']

    def create(self, validated_data):
        time_slots_data = validated_data.pop('time_slots', [])
        doctor = Doctor.objects.create(**validated_data)

        for slot_data in time_slots_data:
            DoctorWorkingTime.objects.create(doctor=doctor, **slot_data)

        return doctor
      
class DoctorUpdateSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(required=False)
    user_fullname = serializers.CharField(required=False)
    user_gender = serializers.ChoiceField(choices=User.gender_options, required=False)
    doctor_photo = serializers.ImageField(required=False)  # Optional for updates
    time_slots = DoctorTimeSlotSerializer(many=True, required=False)

    class Meta:
        model = Doctor
        fields = ["user_email", "user_fullname", "user_gender", "doctor_photo", "doctor_type","doctor_status", "time_slots" ,"doctor_degree"]

    def update(self, instance, validated_data):
        user_data = {}
        time_slots_data = validated_data.pop('time_slots', None)
        # Handle user-related fields separately
        if "user_email" in validated_data:
            existing_user = User.objects.filter(user_email=validated_data["user_email"]).exclude(id=instance.user.id)
            if existing_user.exists():
                raise serializers.ValidationError({"user_email": "User with this email already exists."})
            user_data["user_email"] = validated_data.pop("user_email")

        if "user_fullname" in validated_data:
            user_data["user_fullname"] = validated_data.pop("user_fullname")

        if "user_gender" in validated_data:
            user_data["user_gender"] = validated_data.pop("user_gender")

        # Update User model
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update Doctor model
        instance = super().update(instance, validated_data)
        if time_slots_data is not None:
           
            instance.time_slots.all().delete()
            
            
            for slot_data in time_slots_data:
                DoctorWorkingTime.objects.create(
                    doctor_id=instance,  
                    start_time=slot_data['start_time'],
                    end_time=slot_data['end_time']
                )

        return instance

class TokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        token['user_fullname'] = user.user_fullname
        token['user_email'] = user.user_email
        token['user_role'] = user.user_role

        return token

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only= True, 
        required=True,
        validators=[validate_password]
    )
    retype_password = serializers.CharField(write_only= True, 
        required=True)
   
    
    class Meta:
        model=User
        fields=['user_email','user_fullname','password','retype_password']
        extra_kwargs = {
            'user_fullname':{'required': True}
        }
    def validate(self, attrs):
        password = attrs.get('password')
        retype_password = attrs.get('retype_password')
        if password != retype_password:
            raise serializers.ValidationError(
                {"password": "Password fields are not the same"}
            )
        return attrs
    
    def create(self,validated_data):
        validated_data.pop('retype_password')
        user = User.objects.create(
            user_fullname = validated_data['user_fullname'],
            user_email = validated_data['user_email'],

        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
User = get_user_model() 



class SignUpDoctorSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    user_fullname = serializers.CharField(write_only=True)
    user_gender = serializers.ChoiceField(choices=User.gender_options, write_only=True)
    user_role = serializers.IntegerField(default=3, write_only=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    retype_password = serializers.CharField(write_only=True, required=True)
    time_slots = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = Doctor
        fields = [
            "user_email", "user_fullname", "user_gender", "user_role", "password", "retype_password",
            "doctor_photo", "doctor_type", "doctor_status", "doctor_degree", "time_slots"
        ]

    def validate(self, attrs):
        password = attrs.get('password')
        retype_password = attrs.get('retype_password')
        if password != retype_password:
            raise serializers.ValidationError(
                {"password": "Password fields are not the same"}
            )
        
       
        time_slots = []
        i = 0
        while True:
            start_key = f'time_slots[{i}][start_time]'
            end_key = f'time_slots[{i}][end_time]'
            
            if start_key not in self.initial_data:
                break
                
            time_slots.append({
                'start_time': self.initial_data[start_key],
                'end_time': self.initial_data[end_key]
            })
            i += 1
        
        if time_slots:
            attrs['time_slots'] = time_slots
        
        if not time_slots:
            raise serializers.ValidationError(
                {"time_slots": "At least one time slot is required"}
            )
            
        # Validate each time slot
        for slot in time_slots:
            if not isinstance(slot, dict):
                raise serializers.ValidationError(
                    {"time_slots": "Each time slot must be a dictionary"}
                )
            if 'start_time' not in slot or 'end_time' not in slot:
                raise serializers.ValidationError(
                    {"time_slots": "Each time slot must have start_time and end_time"}
                )
                
        return attrs

    def create(self, validated_data):
        user_data = {
            "user_email": validated_data.pop("user_email"),
            "user_fullname": validated_data.pop("user_fullname"),
            "user_gender": validated_data.pop("user_gender"),
            "user_role": 3,
        }
        password = validated_data.pop("password")
        validated_data.pop("retype_password")
        
        # Create user
        user = User.objects.create(**user_data)
        user.set_password(password)
        user.save()
        validated_data.pop("user_role", None) 
        print("Validated Data (Doctor) after removing user_role:", validated_data)
        time_slots_data = validated_data.pop('time_slots', [])
        doctor = Doctor.objects.create(user=user, **validated_data)

        # Create time slots
        for slot_data in time_slots_data:
            DoctorWorkingTime.objects.create(
                doctor_id=doctor,
                start_time=slot_data['start_time'],
                end_time=slot_data['end_time']
            )

        return doctor

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user_name', 'anonymous']
        read_only_fields = ['id', 'created_at', 'user_name']

class ForumSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Forum
        fields = ['id', 'post_title', 'post_detail', 'post_date', 
                 'anonymous', 'user_id', 'user_name', 'comments']

class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = ['id','music','type_music','mood_id']
class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id','type_mood','mood_date','user_id']
class BlogSerializer(serializers.ModelSerializer):
    
    therapist_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())

     # get the therapist name
    therapist_name = serializers.CharField(source='therapist_id.user.user_fullname', read_only=True)
    
    class Meta:
        model = Blog
        fields = ['id', 'blog_image', 'blog_title', 'blog_detail', 'blog_date','blog_category', 'therapist_id', 'therapist_name']

class AppointmentSerializer(serializers.ModelSerializer):
    
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

     # get the user name
    user_fullname = serializers.CharField(source='user_id.user_fullname', read_only=True)

    therapist_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())

     # get the therapist name
    therapist_name = serializers.CharField(source='therapist_id.user.user_fullname', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'user_id', 'therapist_id', 'appointment_date', 'appointment_status','user_fullname','therapist_name']  
    def validate(self, data):
        
        appointment_date = data.get('appointment_date')
        therapist_id = data.get('therapist_id')
        
       
        buffer_time = timedelta(minutes=15) 
        
        conflicting_appointments = Appointment.objects.filter(
            therapist_id=therapist_id,
            appointment_date__range=(
                appointment_date - buffer_time,
                appointment_date + buffer_time
            ),
            appointment_status__in=[1, 2, 4] 
        ).exists()
        
        if conflicting_appointments:
            raise ValidationError("This time slot is already booked or too close to another appointment.")
        
        return data

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user_id.username") 
    therapist_name = serializers.ReadOnlyField(source="therapist_id.user.user_fullname") 

    class Meta:
        model = Review
        fields = ["id", "review_date", "review_post", "doctor_ratings", "user_id", "user_name", "therapist_id", "therapist_name"]

    def validate_review_post(self, value):
       
        if len(value) < 10:
            raise serializers.ValidationError("Review must be at least 10 characters long.")
        return value