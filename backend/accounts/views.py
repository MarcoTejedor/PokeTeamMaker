from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, 
    UserProfileUpdateSerializer, UserDetailSerializer
)
from .models import UserProfile

class RegisterView(APIView):
    """
    API view for user registration.
    POST: Create a new user account.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Log the user in immediately after registration
            login(request, user)

            return Response(
                {
                    'message': 'User registered successfully.',
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API view for user login.
    POST: Authenticate user and create session.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return Response(
                    {
                        'message': 'Login successful.',
                        'user_id': user.id,
                        'username': user.username,
                        'email': user.email,
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Invalid username or password.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API view for user logout.
    POST: Destroy user session.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response(
            {'message': 'Logout successful.'},
            status=status.HTTP_200_OK
        )


class UserProfileView(APIView):
    """
    API view for retrieving user profile.
    GET: Return authenticated user's profile information.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileUpdateView(RetrieveUpdateAPIView):
    """
    API view for updating user profile.
    GET: Retrieve user profile.
    PUT: Update user profile information.
    PATCH: Partially update user profile.
    """
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile