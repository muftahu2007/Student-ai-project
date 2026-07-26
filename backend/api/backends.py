from django.contrib.auth.models import User
from django.db.models import Q

class EmailAuthBackend:
    """
    Custom authentication backend to allow users to log in using either their username or email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username:
            return None
            
        username = str(username).strip()
            
        try:
            # Get all users that match the username or email (case-insensitive)
            users = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username))
            
            for user in users:
                if user.check_password(password):
                    return user
        except Exception:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
