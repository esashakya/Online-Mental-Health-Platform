from django.shortcuts import render
from api.models import *
from api.serializer import *
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
# Create your views here.
class TokenPairView(TokenObtainPairView):
    serializer_class = TokenSerializer

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def DashboardView(request):
    
    if request.method =="GET":
        data = f"Hey{request.user},GET response"
        return Response({'response':data},status=status.HTTP_200_OK)

    elif request.method == 'POST':
        text = request.POST.get("text")
        data = f"Hey{request.user},{text}"
        return Response({'response':data},status=status.HTTP_200_OK)

    return Response({},status=status.HTTP_400_BAD_REQUEST)
    

