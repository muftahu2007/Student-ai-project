import pytest
from unittest.mock import patch, MagicMock
from api.rag_utils import (
    get_chroma_collection,
    _setup_genai,
    get_gemini_embedding,
    process_and_store_document,
    retrieve_context,
)

# Reset chroma_db globals before tests to avoid side-effects
@pytest.fixture(autouse=True)
def reset_globals():
    import api.rag_utils
    api.rag_utils._chroma_client = None
    api.rag_utils._collection = None
    yield
    api.rag_utils._chroma_client = None
    api.rag_utils._collection = None

@patch('api.rag_utils.chromadb.PersistentClient')
def test_get_chroma_collection(mock_client):
    mock_collection = MagicMock()
    mock_client.return_value.get_or_create_collection.return_value = mock_collection
    
    collection1 = get_chroma_collection()
    collection2 = get_chroma_collection()
    
    assert collection1 is mock_collection
    assert collection2 is mock_collection
    # Ensure it only creates client once
    assert mock_client.call_count == 1

@patch('api.rag_utils.settings')
def test_setup_genai_missing_key(mock_settings):
    mock_settings.GEMINI_API_KEY = None
    with pytest.raises(ValueError, match="GEMINI_API_KEY is not set"):
        _setup_genai()

@patch('api.rag_utils.genai.configure')
@patch('api.rag_utils.settings')
def test_setup_genai_success(mock_settings, mock_configure):
    mock_settings.GEMINI_API_KEY = "test_key"
    _setup_genai()
    mock_configure.assert_called_once_with(api_key="test_key")

@patch('api.rag_utils.genai.embed_content')
@patch('api.rag_utils._setup_genai')
def test_get_gemini_embedding(mock_setup, mock_embed):
    mock_embed.return_value = {'embedding': [0.1, 0.2, 0.3]}
    embedding = get_gemini_embedding("test text")
    
    assert embedding == [0.1, 0.2, 0.3]
    mock_setup.assert_called_once()
    mock_embed.assert_called_once_with(
        model="models/text-embedding-004",
        content="test text"
    )

@patch('api.rag_utils.fitz.open')
@patch('api.rag_utils.genai.embed_content')
@patch('api.rag_utils._setup_genai')
@patch('api.rag_utils.get_chroma_collection')
def test_process_and_store_document_success(mock_get_collection, mock_setup, mock_embed, mock_fitz):
    # Mock PDF
    mock_pdf = MagicMock()
    mock_page = MagicMock()
    mock_page.get_text.return_value = "This is a test pdf content."
    mock_pdf.__len__.return_value = 1
    mock_pdf.load_page.return_value = mock_page
    mock_fitz.return_value = mock_pdf
    
    # Mock embeddings
    mock_embed.return_value = {'embedding': [0.1, 0.2]}
    
    # Mock collection
    mock_collection = MagicMock()
    mock_get_collection.return_value = mock_collection
    
    result = process_and_store_document(1, "fake_path.pdf")
    
    assert result is True
    mock_fitz.assert_called_once_with("fake_path.pdf")
    mock_collection.add.assert_called_once()
    
    # Check arguments to add
    kwargs = mock_collection.add.call_args.kwargs
    assert "ids" in kwargs
    assert "embeddings" in kwargs
    assert "metadatas" in kwargs
    assert "documents" in kwargs
    assert len(kwargs["documents"]) > 0
    assert kwargs["metadatas"][0]["document_id"] == 1

@patch('api.rag_utils.fitz.open')
def test_process_and_store_document_pdf_error(mock_fitz):
    mock_fitz.side_effect = Exception("PDF Error")
    result = process_and_store_document(1, "fake_path.pdf")
    assert result is False

@patch('api.rag_utils.get_gemini_embedding')
@patch('api.rag_utils.get_chroma_collection')
def test_retrieve_context_success(mock_get_collection, mock_get_embedding):
    mock_get_embedding.return_value = [0.1, 0.2]
    mock_collection = MagicMock()
    mock_collection.count.return_value = 10
    mock_collection.query.return_value = {
        'documents': [["chunk1", "chunk2"]]
    }
    mock_get_collection.return_value = mock_collection
    
    result = retrieve_context(1, "test query")
    
    assert result == ["chunk1", "chunk2"]
    mock_collection.query.assert_called_once_with(
        query_embeddings=[[0.1, 0.2]],
        n_results=3,
        where={"document_id": 1}
    )

@patch('api.rag_utils.get_gemini_embedding')
@patch('api.rag_utils.get_chroma_collection')
def test_retrieve_context_empty(mock_get_collection, mock_get_embedding):
    mock_collection = MagicMock()
    mock_collection.count.return_value = 0
    mock_get_collection.return_value = mock_collection
    
    result = retrieve_context(1, "test query")
    assert result == []

@patch('api.rag_utils.get_gemini_embedding')
@patch('api.rag_utils.get_chroma_collection')
def test_retrieve_context_error(mock_get_collection, mock_get_embedding):
    mock_get_embedding.side_effect = Exception("Embed Error")
    result = retrieve_context(1, "test query")
    assert result == []
