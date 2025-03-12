from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from api.models import *
from api.serializer import *
from rest_framework.decorators import parser_classes
from rest_framework import viewsets
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.
class TokenPairView(TokenObtainPairView):
    serializer_class = TokenSerializer

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer
class AddView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
class SignUpDoctorView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignUpDoctorSerializer    
    parser_classes = (MultiPartParser, FormParser)
class AddBlogView(generics.CreateAPIView):
    queryset = Blog.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = BlogSerializer    
    parser_classes = (MultiPartParser, FormParser)

class ForumViewSet(viewsets.ModelViewSet):
    queryset = Forum.objects.all()
    permission_classes = [IsAuthenticated] 
    serializer_class = ForumSerializer
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])  
def get_doctors(request):
    # fetches all the forum posts
    doctors = Doctor.objects.all() 
    # convert into json with the use of json
    serializer = DoctorSerializer(doctors, many=True)  
    return Response(serializer.data)

# for doctor
@api_view(['PUT','DELETE'])
@parser_classes([MultiPartParser, FormParser])
def update_doctor(request, pk):
    print("Function  called")
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        print("Content type:",request.content_type)
        print("Request Data:", request.data)
        

        doctor_data = request.data
        if 'user_email' in doctor_data or 'user_fullname' in doctor_data or 'user_gender' in doctor_data:
            # if any of user data is updated,it is changed otherwise it is kept same
            user_data = {
                'user_email': doctor_data.get('user_email', doctor.user.user_email),
                'user_fullname': doctor_data.get('user_fullname', doctor.user.user_fullname),
                'user_gender': doctor_data.get('user_gender', doctor.user.user_gender)
            }

            
            user = doctor.user 
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            # update the data
            if user_serializer.is_valid():
                user_serializer.save()

        serializer = DoctorSerializer(doctor,data=doctor_data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
# for user
@api_view(['GET'])
@permission_classes([AllowAny])  
def get_users(request):
    # fetches all the user posts
    users = User.objects.all() 
    # convert into json with the use of json
    serializer = UserSerializer(users, many=True)  
    return Response(serializer.data)
@api_view(['PUT','DELETE'])
@parser_classes([MultiPartParser, FormParser])
def update_user(request, pk):
    print("Function  called")
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        print("Content type:",request.content_type)
        print("Request Data:", request.data)
        

        user_data = request.data
        
        serializer = UserSerializer(user,data=user_data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# for blog posts
@api_view(['GET'])
@permission_classes([AllowAny])  
def get_blogs(request):
    # fetches all the blog posts
    blogs = Blog.objects.all() 
    # convert into json with the use of json
    serializer = BlogSerializer(blogs, many=True)  
    return Response(serializer.data)

@api_view(['PUT','DELETE'])
@parser_classes([MultiPartParser, FormParser])
def update_blog(request, pk):
    print("Function  called")
    try:
        blog = Blog.objects.get(pk=pk)
    except Blog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        print("Content type:",request.content_type)
        print("Request Data:", request.data)
        

        blog_data = request.data
        
        serializer = BlogSerializer(blog,data=blog_data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)