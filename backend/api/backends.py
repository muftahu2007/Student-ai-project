from django.contrib.auth.models import User
from django.db.models import Q

class EmailAuthBackend:
    """
    Custom authentication backend to allow users to log in using either their username or email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if user exists with the given username or email
            user = User.objects.filter(Q(username=username) | Q(email=username)).first()
            if user and user.check_password(password):
                return user
        except Exception:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
