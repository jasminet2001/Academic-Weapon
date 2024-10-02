from .serializers import SubtaskSerializer
from .models import Task, Subtask
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
from django.contrib.auth.models import User
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import NoteSerializer
from .models import Note
from django.shortcuts import render
from rest_framework import status
from .serializers import UserSerializer
import google.auth.transport.requests
from google.oauth2 import id_token
from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST'])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({
            "tokens": tokens,
            "user": {
                "email": user.email,
                "name": user.name
            }
        }, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


User = get_user_model()


@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')

    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID"
        idinfo = id_token.verify_oauth2_token(
            token, google.auth.transport.requests.Request(), CLIENT_ID)

        # ID token is valid. Get the user's Google account information
        email = idinfo['email']
        name = idinfo['name']

        # Check if the user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # If the user doesn't exist, create a new one No password for Google login
            user = User.objects.create_user(
                email=email, name=name, password=None)
            user.save()

        return Response({"message": "Google login successful", "user": {"email": email, "name": name}}, status=status.HTTP_200_OK)

    except ValueError:
        # Invalid token
        return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notes_list_create(request):
    if request.method == 'GET':
        # Get all notes for the authenticated user
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Create a new note for the authenticated user
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            # Associate note with the logged-in user
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def note_detail(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user  # Get the currently authenticated user

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return tasks for the logged-in user
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the logged-in user
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        # Allow partial updates to toggle task completion
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_subtask(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = SubtaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
