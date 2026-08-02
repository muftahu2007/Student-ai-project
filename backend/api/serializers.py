from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Document, StudentProfile

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'title', 'file', 'uploaded_at', 'pages', 'extracted_text')
        read_only_fields = ('id', 'uploaded_at', 'pages', 'extracted_text')

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ('full_name', 'matric_number', 'department', 'faculty', 'level')

    def validate_matric_number(self, value):
        val = value.strip().upper()
        instance = getattr(self, 'instance', None)
        qs = StudentProfile.objects.filter(matric_number__iexact=val)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A profile with this Matriculation Number already exists.")
        return val

    def create(self, validated_data):
        user = validated_data.pop('user', None)
        profile = StudentProfile(**validated_data)
        if user:
            profile.user = user
        profile.save()
        return profile

    def update(self, instance, validated_data):
        # Ignore 'user' if accidentally passed during update
        validated_data.pop('user', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

from .models import StudySchedule
class StudyScheduleSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    class Meta:
        model = StudySchedule
        fields = ('id', 'exam_name', 'exam_date', 'documents', 'schedule_data', 'created_at')
        read_only_fields = ('id', 'created_at')
