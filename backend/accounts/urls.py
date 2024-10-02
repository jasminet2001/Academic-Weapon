from django.urls import path
from .views import sign_up, login, google_login, notes_list_create, note_detail, update_profile, get_profile, TaskViewSet, add_subtask
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('signup/', sign_up, name='sign-up'),
    path('google-login/', google_login, name='google_login'),
    path('login/', login, name='login'),
    path('notes/', notes_list_create, name='notes_list_create'),
    path('notes/<int:pk>/', note_detail, name='note_detail'),
    path('update-profile/', update_profile, name='update_profile'),
    path('profile/', get_profile, name='get_profile'),

    # Task URLs
    path('tasks/', TaskViewSet.as_view({
        'get': 'list',       # Get list of tasks (GET)
        'post': 'create'     # Create a new task (POST)
    }), name='tasks_list_create'),
    path('tasks/<int:pk>/', TaskViewSet.as_view({
        'get': 'retrieve',   # Get task details (GET)
        'put': 'update',     # Full update a task (PUT)
        'patch': 'partial_update',  # Partial update task (PATCH)
        'delete': 'destroy'  # Delete a task (DELETE)
    }), name='tasks_detail'),
    path('tasks/<int:task_id>/subtasks/', add_subtask, name='add_subtask'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
