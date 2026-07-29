"""
conftest.py – project-level pytest fixtures and module stubs.

All heavy third-party packages that are NOT needed for logic testing are
stubbed out here BEFORE Django's app registry is populated.  This lets
pytest collect and run every test even when the optional packages (
chromadb, PyMuPDF, reportlab, google-genai) are not installed in the venv.
"""

import sys
import types
from unittest.mock import MagicMock


def _make_stub(name):
    """Return a MagicMock registered under *name* and all dotted sub-names."""
    parts = name.split(".")
    root = parts[0]
    if root not in sys.modules:
        sys.modules[root] = MagicMock(name=root)
    mod = sys.modules[root]
    for i, part in enumerate(parts[1:], 2):
        full = ".".join(parts[:i])
        if full not in sys.modules:
            child = MagicMock(name=full)
            setattr(mod, part, child)
            sys.modules[full] = child
        mod = sys.modules[full]
    return mod


# ── llm_client (replaces litellm) ────────────────────────────────────────────
# The views module imports call_completion from api.llm_client.
# We stub it so tests don't make real HTTP calls.
llm_client_stub = _make_stub("api.llm_client")
llm_client_stub.call_completion = MagicMock(return_value="mocked llm response")

# ── google / google.genai / google.generativeai ───────────────────────────────
_make_stub("google")
_make_stub("google.genai")
_make_stub("google.generativeai")

# ── fitz (PyMuPDF) ───────────────────────────────────────────────────────────
fitz_stub = _make_stub("fitz")

# ── chromadb ─────────────────────────────────────────────────────────────────
chromadb_stub = _make_stub("chromadb")
_fake_collection = MagicMock()
_fake_collection.count.return_value = 0
_fake_collection.query.return_value = {"documents": [[]]}
_fake_client = MagicMock()
_fake_client.get_or_create_collection.return_value = _fake_collection
chromadb_stub.PersistentClient.return_value = _fake_client

# ── reportlab ────────────────────────────────────────────────────────────────
_make_stub("reportlab")
_make_stub("reportlab.lib")
_make_stub("reportlab.lib.pagesizes")
_make_stub("reportlab.lib.styles")
_make_stub("reportlab.platypus")
sys.modules["reportlab.lib.pagesizes"].letter = (612, 792)
sys.modules["reportlab.lib.styles"].getSampleStyleSheet = MagicMock(return_value={
    "Heading1": MagicMock(spaceAfter=12, leading=14),
    "Normal": MagicMock(spaceAfter=12, leading=14),
})
_make_stub("reportlab.platypus")
sys.modules["reportlab.platypus"].SimpleDocTemplate = MagicMock()
sys.modules["reportlab.platypus"].Paragraph = MagicMock()
sys.modules["reportlab.platypus"].Spacer = MagicMock()

# ── langchain_text_splitters ──────────────────────────────────────────────────
lts = _make_stub("langchain_text_splitters")
lts.RecursiveCharacterTextSplitter = MagicMock(return_value=MagicMock(
    split_text=MagicMock(return_value=["chunk1", "chunk2"])
))
