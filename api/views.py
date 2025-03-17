from django.shortcuts import render
import json  
from datetime import datetime
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from api.models import *
from api.serializer import *
from django.shortcuts import get_object_or_404
from rest_framework.decorators import parser_classes
from rest_framework import viewsets
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes,action
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
from django.http import JsonResponse
from django.core.mail import send_mail
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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_preferred_doctor(request,id):
    doctor = get_object_or_404(Doctor, id=id) 
    serializer = DoctorSerializer(doctor)
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
def get_preferred_user(request,id):
    user = get_object_or_404(User, id=id) 
    serializer = UserSerializer(user)
    return Response(serializer.data)
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
@api_view(['POST'])
@permission_classes([AllowAny])
def book_appointment(request):
    print("Received request data:", request.data)
    # get the data front frontend(request)
    doctor_id = request.data.get('doctor_id')
    date_time = request.data.get('date_time')
    user_id = request.data.get('user_id')  
    # debug
    if not doctor_id or not date_time or not user_id:
        return JsonResponse({"error": "Missing doctor_id, date_time, or user_id"}, status=400)

    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=400)

    # convering into django date time object
    try:
        date_time = datetime.fromisoformat(date_time.replace("Z", "+00:00"))
    except ValueError:
        return JsonResponse({"error": "Invalid date format. Expected ISO 8601 format."}, status=400)

    # check if doctor exists or not
    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return JsonResponse({"error": "Doctor not found"}, status=400)

    # creating the appointment
    appointment = Appointment.objects.create(
        user_id=user,  
        therapist_id=doctor, 
        appointment_date=date_time,
        appointment_status=2  #pending
    )
    # sending gmail to doctor to inform about new appointment
    subject = f"New Appointment Request: {user.user_fullname} - {date_time.strftime('%B %d, %Y at %I:%M %p')}"
    message = f"""
    Dear Dr. {doctor.user.user_fullname},

    We hope this email finds you well.

    We would like to inform you that a new appointment request has been made by one of your patients. Here are the details:

    - Patient Name: {user.user_fullname}
    - Appointment Date & Time: {date_time.strftime('%B %d, %Y at %I:%M %p')}
    - Patient Email: {user.user_email}
    - Appointment Status: Pending

    Please review and confirm your availability for the scheduled time.

    Thank you for your time and attention. Should you have any questions, feel free to reach out.

    Best regards,
    UntangleChaos Team
    """

    # send the mail
    send_mail(
        subject,
        message,
        'UntangleChaos@gmail.com',  # Your email
        [doctor.user.user_email]  # Doctor's email
    )
    

    return JsonResponse({"message": "Appointment registered successfully", "appointment_id": appointment.id}, status=201)
@api_view(['POST'])
@permission_classes([AllowAny])
def approve_appointment(request):
    appointment_id = request.data.get('id')
    approved = request.data.get('approved', False)  # Boolean: True or False

    try:
        appointment = Appointment.objects.get(id=appointment_id)

        # Check if the logged-in doctor owns the appointment
        if appointment.doctor.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)

        # Update status based on doctor’s decision
        appointment.status = 'confirmed' if approved else 'rejected'
        appointment.save()

        # Notify the patient
        send_mail(
            'Appointment Update',
            f'Your appointment has been {"approved" if approved else "rejected"} by Dr. {appointment.doctor.user.user_name}.',
            'admin@yourclinic.com',
            [appointment.user.user_email]
        )

        return Response({'message': f'Appointment {"approved" if approved else "rejected"}'})
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=404)


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        user = self.request.user

        if user.user_role == 3:  
            return Appointment.objects.filter(therapist_id__user=user)
        else:  
            return Appointment.objects.filter(user_id=user)

    @action(detail=False, methods=['GET'])
    def my_appointments(self, request):
        
        appointments = self.get_queryset()
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)