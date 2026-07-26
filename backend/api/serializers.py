from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Document, StudentProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

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
        fields = ('full_name', 'matric_number', 'department', 'faculty', 'level', 'program')

from .models import StudySchedule
class StudyScheduleSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    class Meta:
        model = StudySchedule
        fields = ('id', 'exam_name', 'exam_date', 'documents', 'schedule_data', 'created_at')
        read_only_fields = ('id', 'created_at')
