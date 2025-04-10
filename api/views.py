from django.shortcuts import render
import json  
import secrets
import string
from datetime import date, timedelta
from django.utils import timezone
import pytz
import requests
from rest_framework.pagination import PageNumberPagination
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.utils.timezone import localtime
from django.utils.dateparse import parse_datetime

from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
from django.http import JsonResponse
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
class AddMusicView(generics.CreateAPIView):
    queryset = Music.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = MusicSerializer    
    parser_classes = (MultiPartParser, FormParser)
class AddMoodView(generics.CreateAPIView):
    parser_classes = [JSONParser] 
    queryset = Mood.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = MoodSerializer   
     
   
class ForumViewSet(viewsets.ModelViewSet):
    queryset = Forum.objects.all()
    permission_classes = [IsAuthenticated] 
    serializer_class = ForumSerializer
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        
        forum_id = self.request.query_params.get('forum', None)
        blog_id = self.request.query_params.get('blog', None)

        
        
        if blog_id is not None:
            return Comment.objects.filter(blog_id=blog_id, comment_category='Blog')

        if forum_id is not None:
            return Comment.objects.filter(forum_id=forum_id, comment_category='Forum')


        return Comment.objects.none()
    def perform_create(self, serializer):
        blog_id = self.request.data.get('blog')
        forum_id = self.request.data.get('forum')

        if blog_id:
            try:
                blog = Blog.objects.get(pk=blog_id)
                serializer.save(
                    user=self.request.user,
                    blog=blog,
                    comment_category='Blog'
                )
            except Blog.DoesNotExist:
                raise serializers.ValidationError({"blog": "Blog post does not exist"})
        elif forum_id:
            try:
                forum = Forum.objects.get(pk=forum_id)
                serializer.save(
                    user=self.request.user,
                    forum=forum,
                    comment_category='Forum'
                )
            except Forum.DoesNotExist:
                raise serializers.ValidationError({"forum": "Forum post does not exist"})
        else:
            raise serializers.ValidationError({
                "error": "Either blog or forum ID must be provided"
            })

class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all()
    permission_classes = [IsAuthenticated] 
    serializer_class = MusicSerializer
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['PUT','DELETE'])
@parser_classes([MultiPartParser, FormParser])
def update_music(request, pk):
    print("Function  called")
    try:
        music = Music.objects.get(pk=pk)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        music.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        print("Content type:",request.content_type)
        print("Request Data:", request.data)
        

        music_data = request.data
        
        serializer = MusicSerializer(music,data=music_data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    permission_classes = [IsAuthenticated] 
    serializer_class = MoodSerializer
    
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_mood(request):
    user = request.user
    today = date.today()

   
    if Mood.objects.filter(user_id=user, mood_date=today).exists():
        return Response(
            {"message": "You have already submitted your mood for today."},
            status=status.HTTP_400_BAD_REQUEST
        )

   
    serializer = MoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_id=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
@api_view(['GET'])
@permission_classes([AllowAny])
def get_preferred_blog(request,id):
    blog = get_object_or_404(Blog, id=id) 
    serializer = BlogSerializer(blog)
    return Response(serializer.data)

# for doctor
@api_view(['PUT','DELETE'])
@parser_classes([MultiPartParser, FormParser])
def update_doctor(request, pk):
    print("Function called")
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        print("Content type:", request.content_type)
        print("Request Data:", request.data)
        
        # Create a mutable copy of the request data
        doctor_data = request.data.copy()
        
        if 'user_email' in doctor_data or 'user_fullname' in doctor_data or 'user_gender' in doctor_data:
            # if any of user data is updated, it is changed otherwise it is kept same
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

        if 'time_slots' in doctor_data:
            try:
                time_slots = json.loads(doctor_data['time_slots'])
                # Create a new mutable dictionary with the updated time_slots
                updated_data = doctor_data.dict()
                updated_data['time_slots'] = time_slots
                doctor_data = updated_data
            except json.JSONDecodeError:
                return Response({"error": "Invalid time_slots format"}, 
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = DoctorUpdateSerializer(doctor, data=doctor_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def create_review(request):
    
  
    doctor_id = request.data.get('therapist_id')
    review_post = request.data.get('review_post')
    doctor_ratings = request.data.get('doctor_ratings')

    
    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)

   
    review_data = {
        'review_post': review_post,
        'doctor_ratings': doctor_ratings,
        'user_id': request.user.id,  
        'therapist_id': doctor.id
    }

  
    serializer = ReviewSerializer(data=review_data)

    if serializer.is_valid():
       
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)  
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
# for review posts
@api_view(['GET'])
@permission_classes([AllowAny])  
def get_reviews(request):
    doctor_id = request.query_params.get('doctor_id', None)
    # fetches all the review posts
    if doctor_id:
        reviews = Review.objects.filter(therapist_id=doctor_id)
    else:
        reviews = Review.objects.all()
    

    
    paginator = PageNumberPagination()
    paginator.page_size = 10  
    paginated_reviews = paginator.paginate_queryset(reviews, request)

    
    serializer = ReviewSerializer(reviews, many=True)  
    return paginator.get_paginated_response(serializer.data)


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
    doctor_id = request.data.get('therapist_id')
    date_time = request.data.get('appointment_date')
    user_id = request.data.get('user_id')  
    appointment_status = request.data.get('appointment_status')
    # debug
    if not doctor_id or not date_time or not user_id or not appointment_status:
        return JsonResponse({"error": "Missing doctor_id, date_time, or user_id or appointment_status"}, status=400)

    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=400)

    # convering into django date time object
    try:
       
        date_time = parse_datetime(date_time)
        if date_time is None:
            return JsonResponse({"error": "Invalid datetime format"}, status=400)

        
        if timezone.is_naive(date_time):
            date_time = timezone.make_aware(date_time, timezone.utc)

       
        local_tz = pytz.timezone("Asia/Kathmandu") 
        local_time = date_time.astimezone(local_tz)


    except ValueError:
        return JsonResponse({"error": "Invalid date format"}, status=400)

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
       
    )
    # sending gmail to doctor to inform about new appointment
    subject = f"New Appointment Request: {user.user_fullname} - {local_time.strftime('%B %d, %Y at %I:%M %p')}"
    message = f"""
    Dear Dr. {doctor.user.user_fullname},

    We hope this email finds you well.

    We would like to inform you that a new appointment request has been made by one of your patients. Here are the details:

    - Patient Name: {user.user_fullname}
    - Appointment Date & Time: {local_time.strftime('%B %d, %Y at %I:%M %p')}
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
        'UntangleChaos@gmail.com',  
        [doctor.user.user_email] 
    )
    

    return JsonResponse({"message": "Appointment registered successfully", "appointment_id": appointment.id}, status=201)
@api_view(['POST'])
@permission_classes([AllowAny])
def approve_appointment(request):
    appointment_id = request.data.get('id')
    approved = request.data.get('approved', False)  

    try:
        appointment = Appointment.objects.get(id=appointment_id)

        
        if appointment.therapist_id.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)

        
        appointment.status = 4 if approved else 3
        appointment.save()

      
        send_mail(
            'Appointment Update',
            f'Your appointment has been {"approved" if approved else "rejected"} by Dr. {appointment.therapist_id.user.user_fullname}.',
            'admin@yourclinic.com',
            [appointment.user_id.user_email]
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
    def update(self, request, *args, **kwargs):
        print("Received data:", request.data)

        instance = self.get_object()
        previous_date = instance.appointment_date
        previous_status = instance.appointment_status  # Get the previous status
        response = super().update(request, *args, **kwargs)
        updated_instance = self.get_object()
       
        # if status is approved send confirmation mail
        if previous_status != updated_instance.appointment_status and updated_instance.appointment_status == 4:
            print("Sending emails")
            self.send_approval_email(updated_instance)
        elif previous_date != updated_instance.appointment_date:
            print("Sending emails after updating the time")
            self.send_updated_date_email(updated_instance)
        elif updated_instance.appointment_status == 5:
            print ("Confirmed email")
            self.send_confirmed_email(updated_instance)

        return response
    @staticmethod
    def generate_random_code():
        characters = string.ascii_letters + string.digits
        code = ''.join(secrets.choice(characters) for i in range(8))   
        return code
    def send_updated_date_email(self, appointment):
        user_email = appointment.user_id.user_email
        doctor_email = appointment.therapist_id.user.user_email
        formatted_date = localtime(appointment.appointment_date).strftime('%Y-%m-%d %H:%M')
        code = self.generate_random_code() 
        print(code)
        subject = "Your timing has been updated. "
        message = f"""
        Hello {appointment.user_id.user_fullname},
        
        Your appointment with Dr. {appointment.therapist_id.user.user_fullname} is set to be on {formatted_date}. If you are comfortable on the selected date, please confirm your appointment with  your payment.
        
        
        If you have any queries, feel free to contact us in below number.
        5571584
        Thank you.

        Untangle Chaos Management Team
        """
        send_mail(subject, message, 'UntangleChaos@gmail.com', [user_email])
        doctor_message =  f"""
        Hello {appointment.therapist_id.user.user_fullname},

        Your appointment with Dr. {appointment.user_id.user_fullname} on {formatted_date} has been updated. 
        
        If you have any queries related to timing, please contact the following number. 
        Your Join Code for appointment is {code}
        Please check your profile in our website to join the appointment.
        Please be on time.
        5571584
        Thank you.
        """
        send_mail(subject, doctor_message, 'UntangleChaos@gmail.com', [doctor_email])
    def send_confirmed_email(self, appointment):
        user_email = appointment.user_id.user_email
        doctor_email = appointment.therapist_id.user.user_email
        formatted_date = localtime(appointment.appointment_date).strftime('%Y-%m-%d %H:%M')
        code = self.generate_random_code() 
        print(code)
        subject = "Your appointment has been confirmed! "
        message = f"""
        Hello {appointment.user_id.user_fullname},
        Thank you for being patient with us.
        Your appointment with Dr. {appointment.therapist_id.user.user_fullname} is set to be on {formatted_date}. Please visit your profile to join the appointment in selected date.
        Join code for appoint is {code}
        
        
        If you have any queries, feel free to contact us in below number.
        5571584
        Thank you.

        Untangle Chaos Management Team
        """
        send_mail(subject, message, 'UntangleChaos@gmail.com', [user_email])
        doctor_message =  f"""
        Hello {appointment.therapist_id.user.user_fullname},

        Your appointment has been confirmed on {formatted_date} for patient  {appointment.user_id.user_fullname}. 
        
        If you have any queries related to timing, please contact the following number. 
        Your Join Code for appointment is {code}
        Please check your profile in our website to join the appointment.
        Please be on time.
        5571584
        Thank you.
        """
        send_mail(subject, doctor_message, 'UntangleChaos@gmail.com', [doctor_email])

    def send_approval_email(self, appointment):
        user_email = appointment.user_id.user_email
        doctor_email = appointment.therapist_id.user.user_email
        formatted_date = localtime(appointment.appointment_date).strftime('%Y-%m-%d %H:%M')
        appointment_id = appointment.id
    
       
        payment_link = f"http://localhost:3000/Appointment/Payment?appointmentId={appointment_id}"
        subject = "Your Appointment Has Been Approved. Please check the updated timing"
        message = f"""
        Hello {appointment.user_id.user_fullname},

        Your appointment with Dr. {appointment.therapist_id.user.user_fullname} on {formatted_date} has been approved.  If you are comfortable on the selected date, please confirm your appointment with  your payment.
        Link: {payment_link}
        If you have any queries related to timing, please contact the following number.

        Please be on time.
        5571584
        Thank you.
        """
        send_mail(subject, message, 'UntangleChaos@gmail.com', [user_email])

        # Email for doctor
        doctor_subject = "New Approved Appointment"
        doctor_message = f"""
        Hello Dr. {appointment.therapist_id.user.user_fullname},

        You have a new approved appointment with {appointment.therapist_id.user.user_fullname} on {appointment.appointment_date.strftime('%Y-%m-%d %H:%M')}.

        Please check your schedule in website.

        Thank you.
        """
        send_mail(doctor_subject, doctor_message, 'UntangleChaos@gmail.com', [doctor_email])
   




@csrf_exempt
def make_payment(request):

    if request.method == "POST":
        try:
            
            data = json.loads(request.body)
            
           
            return_url = data.get('return_url')
            purchase_order_id = data.get('purchase_order_id')
            amount = data.get('amount')
            website_url = data.get('return_url')

           
            print(return_url, purchase_order_id, amount)

         
            payload = json.dumps({
                "return_url": return_url,
                "website_url": website_url,
                "amount": amount,
                "purchase_order_id": purchase_order_id,
                "purchase_order_name": "test",
                "customer_info": {
                    "name": "Untangle Chaos",
                    "email": "eshakya2004@gmail.com",
                    "phone": "9800000001"
                }
            })

            print("Sending request to Khalti...")
   
    
            url = "https://dev.khalti.com/api/v2/epayment/initiate/"
            headers = {
                'Authorization': 'key 74e75d4a2bff46fbbbb26d693481ed14',
                'Content-Type': 'application/json',
            }

        
            response = requests.post(url, headers=headers, data=payload)
            print("Khalti responded with:", response.status_code, response.text)
           
            if response.status_code == 200:
                return JsonResponse({
                    'status': 'success',
                    'message': 'Payment initialization successful',
                    'payment_url': response.json().get('payment_url'),
                    'data': response.json()  
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Payment initialization failed',
                    'details': response.text 
                })

        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data received',
            })
        except requests.RequestException as e:
            return JsonResponse({
                'status': 'error',
                'message': 'An error occurred while contacting Khalti API',
                'details': str(e)
            })
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Only POST requests are allowed.',
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_appointment_availability(request):
    therapist_id = request.data.get('therapist_id')
    appointment_date = request.data.get('appointment_date')
    print(therapist_id,appointment_date)
    if not therapist_id or not appointment_date:
        return Response({'error': 'Missing required fields'}, status=400)
    
    try:
        appointment_date = timezone.datetime.fromisoformat(appointment_date)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid date format'}, status=400)
    
    buffer_time = timedelta(minutes=30)
    
    conflicting_appointments = Appointment.objects.filter(
        therapist_id=therapist_id,
        appointment_date__range=(
            appointment_date - buffer_time,
            appointment_date + buffer_time
        ),
        appointment_status__in=[1, 2, 4]
    ).exists()
    
    return Response({
        'available': not conflicting_appointments,
        'requested_time': appointment_date,
        'therapist_id': therapist_id
    })