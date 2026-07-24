"""
tests.py – comprehensive pytest test suite for the BUK Scholar AI backend.

Strategy
--------
* All external I/O (LLM calls, ChromaDB, PDF reading) is mocked so that tests
  run fast without network access or real files.
* Patch targets use the module where the name is *looked up*, i.e.
  'api.views._generate'  (not 'some_external_lib.func').
* Background threads are patched via threading.Thread so document uploads
  don't block.
"""

import json
import pytest
from unittest.mock import patch, MagicMock, PropertyMock

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import (
    Document, UserStats, QuizHistory,
    InteractionHistory, StudentProfile, StudySchedule,
)


# ─────────────────────────────────────────────────────────────────────────────
# Shared fixtures
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user(db):
    user = User.objects.create_user(
        username="testuser", password="password123", email="testuser@example.com"
    )
    StudentProfile.objects.create(
        user=user, full_name="Test User",
        department="Computer Science", faculty="Science",
        level="300", matric_number="BUK/21/0001", program="B.Sc CS",
    )
    return user


@pytest.fixture
def auth_client(api_client, create_user):
    api_client.force_authenticate(user=create_user)
    return api_client


@pytest.fixture
def sample_document(create_user):
    return Document.objects.create(
        user=create_user,
        title="Sample PDF",
        pages=3,
        extracted_text="This is sample extracted text used for all AI view tests.",
    )


def _mock_ai_response(text="AI generated text"):
    """Return a MagicMock that looks like our internal MockResponse object."""
    m = MagicMock()
    m.text = text
    return m


# ─────────────────────────────────────────────────────────────────────────────
# Model tests  (100 % coverage target)
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestModels:

    def test_document_str(self, create_user):
        doc = Document.objects.create(user=create_user, title="Intro to CS")
        assert str(doc) == "Intro to CS"

    def test_document_defaults(self, create_user):
        doc = Document.objects.create(user=create_user, title="Doc")
        assert doc.pages == 1
        assert doc.extracted_text is None

    def test_user_stats_str(self, create_user):
        stats = UserStats.objects.create(user=create_user, questions_asked=5)
        assert "testuser" in str(stats)
        assert stats.questions_asked == 5

    def test_user_stats_defaults(self, create_user):
        stats = UserStats.objects.create(user=create_user)
        assert stats.summaries_generated == 0
        assert stats.quizzes_completed == 0
        assert stats.study_streak == 0

    def test_quiz_history_str(self, create_user):
        doc = Document.objects.create(user=create_user, title="AI Notes")
        quiz = QuizHistory.objects.create(
            user=create_user, document=doc,
            quiz_type="objective", total_questions=10, score=7,
        )
        assert "AI Notes" in str(quiz)
        assert quiz.score == 7

    def test_quiz_history_json_fields(self, create_user):
        doc = Document.objects.create(user=create_user, title="Doc")
        quiz = QuizHistory.objects.create(
            user=create_user, document=doc,
            quiz_type="objective", total_questions=5,
            strengths=["topic1"], weaknesses=["topic2"],
            quiz_data=[{"q": "Q1"}], user_answers={"0": 1},
        )
        assert quiz.strengths == ["topic1"]
        assert quiz.weaknesses == ["topic2"]
        assert quiz.user_answers == {"0": 1}

    def test_interaction_history_str(self, create_user):
        doc = Document.objects.create(user=create_user, title="Doc")
        ih = InteractionHistory.objects.create(
            user=create_user, document=doc,
            interaction_type="chat", response="Some answer",
        )
        assert "chat" in str(ih)
        assert ih.response == "Some answer"

    def test_student_profile_str(self, create_user):
        profile = create_user.student_profile
        assert "testuser" in str(profile)
        assert "Computer Science" in str(profile)

    def test_study_schedule_str(self, create_user):
        schedule = StudySchedule.objects.create(
            user=create_user, exam_name="Final Exam", exam_date="2026-12-15",
        )
        assert "Final Exam" in str(schedule)

    def test_study_schedule_many_to_many(self, create_user, sample_document):
        schedule = StudySchedule.objects.create(
            user=create_user, exam_name="Midterm", exam_date="2026-10-10",
        )
        schedule.documents.add(sample_document)
        assert sample_document in schedule.documents.all()


# ─────────────────────────────────────────────────────────────────────────────
# Authentication & registration tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestAuth:

    def test_register_success(self, api_client):
        url = reverse("auth_register")
        response = api_client.post(url, {
            "username": "newstudent",
            "password": "Pass1234!",
            "email": "newstudent@buk.edu.ng",
        })
        assert response.status_code == 201
        assert "access" in response.data
        assert "refresh" in response.data

    def test_register_duplicate_username(self, api_client, create_user):
        url = reverse("auth_register")
        response = api_client.post(url, {
            "username": "testuser",      # already exists
            "password": "AnotherPass1!",
            "email": "other@buk.edu.ng",
        })
        assert response.status_code == 400

    def test_login_success(self, api_client, create_user):
        url = reverse("auth_login")
        response = api_client.post(url, {
            "username": "testuser",
            "password": "password123",
        })
        assert response.status_code == 200
        assert "access" in response.data

    def test_login_wrong_password(self, api_client, create_user):
        url = reverse("auth_login")
        response = api_client.post(url, {
            "username": "testuser",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    def test_reset_password_success(self, api_client, create_user):
        url = reverse("auth_reset_password")
        response = api_client.post(url, {
            "email": "testuser@example.com",
            "new_password": "NewPass999!",
        })
        assert response.status_code == 200

    def test_reset_password_unknown_email(self, api_client):
        url = reverse("auth_reset_password")
        response = api_client.post(url, {
            "email": "nobody@example.com",
            "new_password": "NewPass999!",
        })
        assert response.status_code == 404

    def test_reset_password_missing_fields(self, api_client):
        url = reverse("auth_reset_password")
        response = api_client.post(url, {"email": "x@x.com"})
        assert response.status_code == 400

    def test_unauthenticated_documents(self, api_client):
        response = api_client.get(reverse("documents_list"))
        assert response.status_code in [401, 403]

    def test_unauthenticated_quiz_history(self, api_client):
        response = api_client.get(reverse("quiz_history_list"))
        assert response.status_code in [401, 403]


# ─────────────────────────────────────────────────────────────────────────────
# User profile tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestUserProfile:

    def test_get_profile(self, auth_client):
        response = auth_client.get(reverse("auth_me"))
        assert response.status_code == 200
        assert response.data["username"] == "testuser"
        assert "stats" in response.data
        assert "profile" in response.data

    def test_profile_stats_fields(self, auth_client):
        response = auth_client.get(reverse("auth_me"))
        stats = response.data["stats"]
        assert "questions_asked" in stats
        assert "summaries_generated" in stats
        assert "quizzes_completed" in stats
        assert "study_streak" in stats

    def test_student_profile_get(self, auth_client):
        # The StudentProfileView only exposes POST (create/update), not GET
        response = auth_client.get(reverse("auth_profile"))
        assert response.status_code == 405  # Method Not Allowed

    def test_student_profile_post_update(self, auth_client):
        response = auth_client.post(reverse("auth_profile"), {
            "full_name": "Updated Name",
            "matric_number": "BUK/21/9999",
            "department": "Physics",
            "faculty": "Science",
            "level": "200",
            "program": "B.Sc Physics",
        })
        assert response.status_code in [200, 201]


# ─────────────────────────────────────────────────────────────────────────────
# Document CRUD tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestDocuments:

    def test_list_documents_empty(self, auth_client):
        response = auth_client.get(reverse("documents_list"))
        assert response.status_code == 200
        assert response.data == []

    def test_list_documents_populated(self, auth_client, sample_document):
        response = auth_client.get(reverse("documents_list"))
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Sample PDF"

    @patch("threading.Thread")
    def test_upload_document(self, mock_thread_cls, auth_client):
        mock_thread_cls.return_value.start = MagicMock()
        fake_pdf = SimpleUploadedFile(
            "lecture.pdf", b"%PDF-test-content", content_type="application/pdf"
        )
        response = auth_client.post(
            reverse("documents_list"),
            {"title": "Lecture Notes", "file": fake_pdf},
            format="multipart",
        )
        assert response.status_code == 201
        assert Document.objects.filter(title="Lecture Notes").exists()


# ─────────────────────────────────────────────────────────────────────────────
# Summarize view
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestSummarize:

    @patch("api.views._generate", return_value=_mock_ai_response("Summary text"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_summarize_ok(self, _mock_ext, _mock_gen, auth_client, sample_document):
        url = reverse("document_summarize", kwargs={"doc_id": sample_document.id})
        response = auth_client.post(url)
        assert response.status_code == 200
        assert response.data["summary"] == "Summary text"

    @patch("api.views._generate", return_value=_mock_ai_response("Summary text"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_summarize_increments_stats(self, _mock_ext, _mock_gen, auth_client, sample_document):
        url = reverse("document_summarize", kwargs={"doc_id": sample_document.id})
        auth_client.post(url)
        stats = UserStats.objects.get(user=sample_document.user)
        assert stats.summaries_generated == 1

    @patch("api.views._generate", return_value=_mock_ai_response("Summary"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_summarize_saves_interaction(self, _mock_ext, _mock_gen, auth_client, sample_document):
        auth_client.post(reverse("document_summarize", kwargs={"doc_id": sample_document.id}))
        assert InteractionHistory.objects.filter(
            document=sample_document, interaction_type="summary"
        ).exists()

    @patch("api.views._ensure_extracted_text", return_value=False)
    def test_summarize_no_text(self, _mock_ext, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_summarize", kwargs={"doc_id": sample_document.id})
        )
        assert response.status_code == 400

    def test_summarize_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_summarize", kwargs={"doc_id": 99999})
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Question-Answer view
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestQuestionAnswer:

    @patch("api.views._generate", return_value=_mock_ai_response("42"))
    @patch("api.rag_utils.retrieve_context", return_value=["doc chunk"])
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_ask_ok(self, _ext, _ret, _gen, auth_client, sample_document):
        url = reverse("document_ask", kwargs={"doc_id": sample_document.id})
        response = auth_client.post(url, {"question": "What is the meaning of life?"})
        assert response.status_code == 200
        assert response.data["answer"] == "42"

    @patch("api.views._generate", return_value=_mock_ai_response("42"))
    @patch("api.rag_utils.retrieve_context", return_value=[])
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_ask_increments_stats(self, _ext, _ret, _gen, auth_client, sample_document):
        auth_client.post(
            reverse("document_ask", kwargs={"doc_id": sample_document.id}),
            {"question": "Test?"},
        )
        stats = UserStats.objects.get(user=sample_document.user)
        assert stats.questions_asked == 1

    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_ask_missing_question(self, _ext, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_ask", kwargs={"doc_id": sample_document.id}), {}
        )
        assert response.status_code == 400

    def test_ask_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_ask", kwargs={"doc_id": 99999}),
            {"question": "?"},
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Study Guide view
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestStudyGuide:

    @patch("api.views._generate", return_value=_mock_ai_response("## Study Guide"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_study_guide_ok(self, _ext, _gen, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_study_guide", kwargs={"doc_id": sample_document.id})
        )
        assert response.status_code == 200
        assert response.data["study_guide"] == "## Study Guide"

    @patch("api.views._generate", return_value=_mock_ai_response("Guide"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_study_guide_saves_interaction(self, _ext, _gen, auth_client, sample_document):
        auth_client.post(
            reverse("document_study_guide", kwargs={"doc_id": sample_document.id})
        )
        assert InteractionHistory.objects.filter(interaction_type="study_guide").exists()

    def test_study_guide_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_study_guide", kwargs={"doc_id": 99999})
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Quiz view
# ─────────────────────────────────────────────────────────────────────────────

SAMPLE_QUIZ = [
    {
        "question": "What is 2+2?",
        "topic": "Arithmetic",
        "options": ["1", "2", "3", "4"],
        "correct_answer": 3,
        "explanation": "Because math.",
    }
]


@pytest.mark.django_db
class TestQuiz:

    @patch("api.views._generate", return_value=_mock_ai_response(json.dumps(SAMPLE_QUIZ)))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_quiz_objective(self, _ext, _gen, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_quiz", kwargs={"doc_id": sample_document.id}),
            {"quiz_type": "objective", "num_questions": 1},
        )
        assert response.status_code == 200
        assert "quiz" in response.data
        parsed = json.loads(response.data["quiz"])
        assert len(parsed) == 1
        assert parsed[0]["question"] == "What is 2+2?"

    @patch("api.views._generate", return_value=_mock_ai_response(json.dumps(SAMPLE_QUIZ)))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_quiz_increments_stats(self, _ext, _gen, auth_client, sample_document):
        auth_client.post(
            reverse("document_quiz", kwargs={"doc_id": sample_document.id}),
            {"quiz_type": "objective", "num_questions": 1},
        )
        stats = UserStats.objects.get(user=sample_document.user)
        assert stats.quizzes_completed == 1

    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_quiz_invalid_type(self, _ext, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_quiz", kwargs={"doc_id": sample_document.id}),
            {"quiz_type": "unknown_type", "num_questions": 1},
        )
        assert response.status_code == 400

    def test_quiz_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_quiz", kwargs={"doc_id": 99999}),
            {"quiz_type": "objective"},
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Save quiz result & history
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestQuizHistory:

    def test_save_result_ok(self, auth_client, sample_document):
        response = auth_client.post(reverse("save_quiz_result"), {
            "doc_id": sample_document.id,
            "quiz_type": "objective",
            "score": 8,
            "total_questions": 10,
        })
        assert response.status_code == 200
        assert QuizHistory.objects.filter(score=8).exists()

    def test_save_result_bad_doc(self, auth_client):
        response = auth_client.post(reverse("save_quiz_result"), {
            "doc_id": 99999,
            "quiz_type": "objective",
            "score": 5,
            "total_questions": 10,
        })
        assert response.status_code == 404

    def test_list_history(self, auth_client, sample_document):
        QuizHistory.objects.create(
            user=sample_document.user, document=sample_document,
            quiz_type="objective", total_questions=5, score=3,
        )
        response = auth_client.get(reverse("quiz_history_list"))
        assert response.status_code == 200
        assert len(response.data) >= 1

    def test_list_history_filtered_by_doc(self, auth_client, sample_document):
        QuizHistory.objects.create(
            user=sample_document.user, document=sample_document,
            quiz_type="objective", total_questions=5, score=3,
        )
        url = reverse("quiz_history_list") + f"?doc_id={sample_document.id}"
        response = auth_client.get(url)
        assert response.status_code == 200
        # Response uses 'document_id' key (custom serialisation in the view)
        assert all(
            r["document_id"] == sample_document.id for r in response.data
        )


# ─────────────────────────────────────────────────────────────────────────────
# Grade theory view
# ─────────────────────────────────────────────────────────────────────────────

GRADING_RESULT = [{"score": 90, "feedback": "Excellent!"}]


@pytest.mark.django_db
class TestGradeTheory:

    @patch("api.views._generate", return_value=_mock_ai_response(json.dumps(GRADING_RESULT)))
    def test_grade_ok(self, _gen, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_grade_theory", kwargs={"doc_id": sample_document.id}),
            {"answers": [{"question": "Q1", "suggested_answer": "SA", "user_answer": "UA"}]},
            format="json",
        )
        assert response.status_code == 200
        assert "grading" in response.data

    def test_grade_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_grade_theory", kwargs={"doc_id": 99999}),
            {"answers": []},
            format="json",
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Explain Simpler view
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestExplainSimpler:

    @patch("api.views._generate", return_value=_mock_ai_response("Simpler version."))
    def test_explain_ok(self, _gen, auth_client):
        response = auth_client.post(
            reverse("explain_simpler"), {"text": "Complex academic jargon here."}
        )
        assert response.status_code == 200
        assert response.data["simplified"] == "Simpler version."

    def test_explain_no_text(self, auth_client):
        response = auth_client.post(reverse("explain_simpler"), {})
        assert response.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# Interaction history views
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestInteractionHistory:

    def test_list_empty(self, auth_client):
        response = auth_client.get(reverse("interaction_history_list"))
        assert response.status_code == 200

    def test_list_populated(self, auth_client, sample_document):
        InteractionHistory.objects.create(
            user=sample_document.user, document=sample_document,
            interaction_type="chat", prompt="Why?", response="Because.",
        )
        response = auth_client.get(reverse("interaction_history_list"))
        assert response.status_code == 200
        assert len(response.data) >= 1

    def test_detail_ok(self, auth_client, sample_document):
        # InteractionHistoryDetailView only supports DELETE, not GET
        ih = InteractionHistory.objects.create(
            user=sample_document.user, document=sample_document,
            interaction_type="summary", response="The summary.",
        )
        response = auth_client.delete(
            reverse("interaction_history_detail", kwargs={"pk": ih.pk})
        )
        assert response.status_code == 204  # Successfully deleted
        assert not InteractionHistory.objects.filter(pk=ih.pk).exists()

    def test_detail_wrong_pk(self, auth_client):
        # DELETE on a non-existent pk should return 404
        response = auth_client.delete(
            reverse("interaction_history_detail", kwargs={"pk": 99999})
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Flashcard view
# ─────────────────────────────────────────────────────────────────────────────

FLASHCARDS = [{"front": "Q", "back": "A"}]


@pytest.mark.django_db
class TestFlashcards:

    @patch("api.views._generate", return_value=_mock_ai_response(json.dumps(FLASHCARDS)))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_flashcards_ok(self, _ext, _gen, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_flashcards", kwargs={"doc_id": sample_document.id})
        )
        assert response.status_code == 200
        assert "flashcards" in response.data

    def test_flashcards_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_flashcards", kwargs={"doc_id": 99999})
        )
        assert response.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# Mind-map view
# ─────────────────────────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestMindMap:

    @patch("api.views._generate", return_value=_mock_ai_response("graph TD\nA-->B"))
    @patch("api.views._ensure_extracted_text", return_value=True)
    def test_mindmap_ok(self, _ext, _gen, auth_client, sample_document):
        response = auth_client.post(
            reverse("document_mindmap", kwargs={"doc_id": sample_document.id})
        )
        assert response.status_code == 200
        assert "mindmap" in response.data
        assert "graph TD" in response.data["mindmap"]

    def test_mindmap_wrong_doc(self, auth_client):
        response = auth_client.post(
            reverse("document_mindmap", kwargs={"doc_id": 99999})
        )
        assert response.status_code == 404
