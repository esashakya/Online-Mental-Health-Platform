from api.models import *
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

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
    
    class Meta:
        model=User
        fields=['user_email','user_fullname','password']

    def create(self,validated_data):
        user = User.objects.create(
            user_fullname = validated_data['user_fullname'],
            user_email = validated_data['user_email'],

        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    