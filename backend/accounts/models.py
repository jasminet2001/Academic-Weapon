from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth import get_user_model


class MyUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, profile_photo=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            profile_photo=profile_photo,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email,
            name=name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    profile_photo = models.ImageField(
        upload_to='profile_photos/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


User = get_user_model()


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Task(models.Model):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'

    PRIORITY_CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High')
    ]

    description = models.CharField(max_length=255)
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default=LOW)
    category = models.CharField(max_length=100, blank=True)
    completed = models.BooleanField(default=False)
    # Each task belongs to a user
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.description


class Subtask(models.Model):
    task = models.ForeignKey(
        Task, related_name="subtasks", on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.description
