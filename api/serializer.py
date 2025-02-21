from api.models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
class UserSerializer(serializers.ModelSerializer): #serialize to json format
    class Meta:
        model = User #user class that needs to be serialized
        fields = ['user_fullname','user_email','user_gender','user_role']
class DoctorSerializer(serializers.ModelSerializer): #serialize to json format
    class Meta:
        model = Doctor #user class that needs to be serialized
        fields = ["doctor_fullname", "doctor_email", "doctor_photo",
            "doctor_gender", "doctor_type", "doctor_availableTime", "doctor_password"]
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
        write_only= True, 
        required=True,
        validators=[validate_password]
    )
    retype_password = serializers.CharField(write_only= True, 
        required=True)

    class Meta:
        model = Doctor
        fields = [
            "user_email", "user_fullname", "user_gender", "user_role", "password","retype_password","doctor_photo", "doctor_type", "doctor_availableTime"  
        ]
    def validate(self, attrs):
        password = attrs.get('password')
        retype_password = attrs.get('retype_password')
        if password != retype_password:
            raise serializers.ValidationError(
                {"password": "Password fields are not the same"}
            )
        return attrs
    def create(self, validated_data):
        
        user_data = {
            "user_email": validated_data.pop("user_email"),
            "user_fullname": validated_data.pop("user_fullname"),
            "user_gender": validated_data.pop("user_gender"),
            "user_role": 3,  
        }
        validated_data.pop("retype_password")
        password = validated_data.pop("password")
        validated_data.pop("user_role")

        # Creating the user before creating the doctor
        user = User.objects.create(**user_data)
        user.set_password(password)  
        user.save()

        # Creating the doctor fields
        doctor = Doctor.objects.create(user=user, **validated_data)

        return doctor


