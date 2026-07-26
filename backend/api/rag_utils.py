import os
import fitz
import chromadb
import google.generativeai as genai
from django.conf import settings
from langchain_text_splitters import RecursiveCharacterTextSplitter

_chroma_client = None
_collection = None

def get_chroma_collection():
    global _chroma_client, _collection
    if _collection is None:
        CHROMA_DB_DIR = os.path.join(settings.BASE_DIR, "chroma_db")
        _chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
        _collection = _chroma_client.get_or_create_collection(name="student_documents")
    return _collection

def _setup_genai():
    """Configure google.generativeai."""
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in Django settings.")
    genai.configure(api_key=api_key)

def get_gemini_embedding(text):
    """Generate embedding using google.generativeai SDK."""
    _setup_genai()
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
    )
    return result['embedding']

def process_and_store_document(document_id, file_path):
    """
    1. Extract text from PDF
    2. Chunk the text
    3. Generate embeddings
    4. Store in ChromaDB
    """
    # 1. Extract Text
    text = ""
    try:
        pdf_document = fitz.open(file_path)
        for page_num in range(len(pdf_document)):
            text += pdf_document.load_page(page_num).get_text()
        pdf_document.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return False

    # 2. Chunk Text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_text(text)

    # 3 & 4. Embed and Store (one chunk at a time to avoid batch issues)
    if chunks:
        try:
            _setup_genai()
            embeddings = []
            for chunk in chunks:
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=chunk,
                )
                embeddings.append(result['embedding'])

            collection = get_chroma_collection()
            collection.add(
                ids=[f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))],
                embeddings=embeddings,
                metadatas=[{"document_id": document_id, "chunk_index": i} for i in range(len(chunks))],
                documents=chunks
            )
        except Exception as e:
            print(f"Error during embedding/storage: {e}")
            return False

    return True

def retrieve_context(document_id, query, top_k=3):
    """
    Search ChromaDB for the most relevant chunks for a specific document.
    """
    try:
        query_embedding = get_gemini_embedding(query)

        collection = get_chroma_collection()
        count = collection.count()
        if count == 0:
            return []

        if top_k > count:
            top_k = count

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={"document_id": document_id}
        )

        if results['documents'] and len(results['documents'][0]) > 0:
            return results['documents'][0]
    except Exception as e:
        print(f"RAG retrieval failed: {e}")
    return []
