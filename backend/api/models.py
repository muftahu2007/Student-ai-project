from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    extracted_text = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    pages = models.IntegerField(default=1)

    def __str__(self):
        return self.title

class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    questions_asked = models.IntegerField(default=0)
    summaries_generated = models.IntegerField(default=0)
    quizzes_completed = models.IntegerField(default=0)
    study_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Stats for {self.user.username}"

class QuizHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_history')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='quiz_history')
    quiz_type = models.CharField(max_length=50) # objective, interactive_theory, practice_paper
    score = models.IntegerField(null=True, blank=True)
    total_questions = models.IntegerField()
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    quiz_data = models.JSONField(default=list, blank=True)
    user_answers = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.document.title} - {self.quiz_type} - {self.created_at.strftime('%Y-%m-%d')}"

class InteractionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interaction_history')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='interaction_history')
    interaction_type = models.CharField(max_length=50) # 'chat', 'summary', 'study_guide'
    prompt = models.TextField(blank=True, null=True) # for chat questions
    response = models.TextField() # AI output
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.document.title} - {self.interaction_type} - {self.created_at.strftime('%Y-%m-%d')}"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=255)
    matric_number = models.CharField(max_length=100)
    department = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)
    level = models.CharField(max_length=50)
    program = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.department}"

class StudySchedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedules')
    exam_name = models.CharField(max_length=255)
    exam_date = models.DateField()
    documents = models.ManyToManyField(Document, related_name='schedules')
    schedule_data = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.exam_name}"
