import pytest
import chromadb
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Document, StudentProfile
import api.rag_utils

@pytest.fixture
def mock_chroma_persistent():
    # Since chromadb is mocked in conftest, we configure the stub here
    fake_collection = MagicMock()
    fake_collection.count.return_value = 1
    fake_collection.query.return_value = {
        'documents': [["This is the chunk content from chromadb."]]
    }
    
    fake_client = MagicMock()
    fake_client.get_or_create_collection.return_value = fake_collection
    
    with patch('api.rag_utils.chromadb.PersistentClient', return_value=fake_client):
        api.rag_utils._chroma_client = None
        api.rag_utils._collection = None
        yield fake_client
        api.rag_utils._chroma_client = None
        api.rag_utils._collection = None

@pytest.fixture
def create_user(db):
    user = User.objects.create_user(
        username="test_integ_user", password="password123", email="integ@example.com"
    )
    StudentProfile.objects.create(
        user=user, full_name="Integ User",
        department="Computer Science", faculty="Science",
        level="300", matric_number="BUK/21/0002", program="B.Sc CS",
    )
    return user

@pytest.fixture
def auth_client(create_user):
    client = APIClient()
    client.force_authenticate(user=create_user)
    return client

@pytest.fixture
def setup_document_in_chroma(create_user, mock_chroma_persistent):
    # Create the document in DB
    doc = Document.objects.create(
        user=create_user,
        title="Integration Doc",
        pages=1,
        extracted_text="This is an integration test document."
    )
    return doc

@pytest.mark.django_db
@patch('api.views._generate')
@patch('api.rag_utils.get_gemini_embedding')
@patch('api.views._ensure_extracted_text', return_value=True)
def test_ask_question_integration(_mock_ext, mock_embed, mock_generate, auth_client, setup_document_in_chroma):
    """
    Integration test: Ask a question.
    - View handles request
    - Calls rag_utils.retrieve_context (NOT MOCKED)
    - retrieve_context queries our mocked ChromaDB
    - View formats prompt and calls _generate
    """
    # Mock the embedding generation so ChromaDB query works
    mock_embed.return_value = [0.1, 0.2, 0.3]
    
    # Mock the LLM text generation
    mock_response = MagicMock()
    mock_response.text = "This is the generated answer."
    mock_generate.return_value = mock_response
    
    url = reverse("document_ask", kwargs={"doc_id": setup_document_in_chroma.id})
    print("DEBUG: collection=", api.rag_utils.get_chroma_collection())
    print("DEBUG: type(count)=", type(api.rag_utils.get_chroma_collection().count()))
    
    response = auth_client.post(url, {"question": "What is the chunk content?"})
    
    assert response.status_code == 200
    assert response.data["answer"] == "This is the generated answer."
    
    # Verify the LLM was called with a prompt containing the chunk from ChromaDB
    mock_generate.assert_called_once()
    prompt_arg = mock_generate.call_args[0][0]
    
    assert "This is the chunk content from chromadb." in prompt_arg
    assert "What is the chunk content?" in prompt_arg
