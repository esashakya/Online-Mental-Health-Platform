from api.models import *
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
class UserSerializer(serializers.ModelSerializer): #serialize to json format
    class Meta:
        model = User #user class that needs to be serialized
        fields = ['user_fullname','user_email','user_gender','user_role']

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
    
class SignUpDoctorSerializer(serializers.ModelSerializer):
    doctor_password = serializers.CharField(
        write_only= True, 
        required=True,
        validators=[validate_password]
    )
    
   
    
    class Meta:
        model=Doctor
        fields=['doctor_fullname','doctor_email','doctor_photo','doctor_gender','doctor_type','doctor_availableTime','doctor_password']
        extra_kwargs = {
            'doctor_fullname':{'required': True}
        }
    
    
    def create(self,validated_data):
        hashed_password = make_password(validated_data['doctor_password'])
        doctor_photo = validated_data.get('doctor_photo', None)
        doctor = Doctor.objects.create(
            doctor_fullname = validated_data['doctor_fullname'],
            doctor_email = validated_data['doctor_email'],
            doctor_photo = doctor_photo,
            
            doctor_gender = validated_data['doctor_gender'],
            doctor_type = validated_data['doctor_type'],
            doctor_availableTime = validated_data['doctor_availableTime'],
            doctor_password=hashed_password

        )
        
        doctor.save()
        return doctor
    