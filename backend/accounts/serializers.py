from .models import Task, Subtask
from rest_framework import serializers
from .models import MyUser
from django.contrib.auth import get_user_model
from .models import Note

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = MyUser
        fields = ['id', 'email', 'name', 'password', 'profile_photo']
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Hash the new password

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def create(self, validated_data):
        user = MyUser(
            email=validated_data['email'],
            name=validated_data['name'],
            profile_photo=validated_data.get('profile_photo', None),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'description',
                  'date_created', 'date_modified']


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, required=False)

    class Meta:
        model = Task
        fields = ['id', 'description', 'due_date',
                  'priority', 'category', 'completed', 'subtasks']

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        task = Task.objects.create(**validated_data)
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        return task
