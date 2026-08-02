"""
llm_client.py – Lightweight direct HTTP calls to LLM providers.

Replaces the heavy `litellm` library (~200MB RAM) with simple `requests`
calls. Supports Groq, OpenRouter, and Google Gemini APIs.

All providers use their native REST APIs:
  - Groq & OpenRouter: OpenAI-compatible chat completions
  - Gemini: Google GenerativeAI REST API

For non-streaming calls, functions return the response text (str).
For streaming calls, functions return a generator yielding text chunks.
"""

import os
import json
import requests


# ---------------------------------------------------------------------------
# Provider-specific callers
# ---------------------------------------------------------------------------

def _call_openai_compatible(url, api_key, model, messages, stream, timeout=25):
    """
    Call an OpenAI-compatible chat completion endpoint (Groq, OpenRouter).
    Returns text (str) or a generator of text chunks if stream=True.
    """
    if not api_key:
        raise ValueError(f"API key not set for {url}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": model,
        "messages": messages,
        "stream": stream,
    }

    if stream:
        resp = requests.post(url, headers=headers, json=payload,
                             timeout=timeout, stream=True)
        resp.raise_for_status()

        def _gen():
            for line in resp.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data_str)
                    delta = chunk.get("choices", [{}])[0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        yield content
                except json.JSONDecodeError:
                    continue
        return _gen()

    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"]


def _call_gemini(api_key, model_name, messages, stream, timeout=25):
    """
    Call Google Gemini API directly via the REST endpoint.
    Converts OpenAI-style messages to Gemini's content format.
    Returns text (str) or a generator of text chunks if stream=True.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")

    # Convert OpenAI message format → Gemini format
    contents = []
    system_text = None

    for msg in messages:
        role = msg.get("role", "user")

        if role == "system":
            system_text = msg["content"]
            continue

        gemini_role = "user" if role == "user" else "model"

        # Handle multimodal content (vision / image messages)
        if isinstance(msg["content"], list):
            parts = []
            for part in msg["content"]:
                if part.get("type") == "text":
                    parts.append({"text": part["text"]})
                elif part.get("type") == "image_url":
                    data_url = part["image_url"]["url"]
                    if data_url.startswith("data:"):
                        header, b64_data = data_url.split(";base64,", 1)
                        mime_type = header.split(":")[1]
                        parts.append({
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": b64_data,
                            }
                        })
            contents.append({"role": gemini_role, "parts": parts})
        else:
            contents.append({
                "role": gemini_role,
                "parts": [{"text": msg["content"]}],
            })

    payload = {"contents": contents}
    if system_text:
        payload["system_instruction"] = {"parts": [{"text": system_text}]}

    if stream:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model_name}:streamGenerateContent?alt=sse&key={api_key}"
        )
        resp = requests.post(url, json=payload, timeout=timeout, stream=True)
        resp.raise_for_status()

        def _gen():
            for line in resp.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                try:
                    chunk = json.loads(line[6:])
                    text = (
                        chunk.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "")
                    )
                    if text:
                        yield text
                except (json.JSONDecodeError, IndexError, KeyError):
                    continue
        return _gen()

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model_name}:generateContent?key={api_key}"
    )
    resp = requests.post(url, json=payload, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]


# ---------------------------------------------------------------------------
# Unified entry point  (drop-in replacement for litellm.completion)
# ---------------------------------------------------------------------------

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def call_completion(model_id: str, messages: list, stream: bool = False, timeout: int = 25):
    """
    Route a chat completion request to the correct provider based on the
    model_id prefix (groq/, openrouter/, gemini/).

    Returns:
        str   – full response text  (when stream=False)
        generator[str] – yields text chunks (when stream=True)
    """
    if model_id.startswith("groq/"):
        model_name = model_id[len("groq/"):]
        api_key = os.environ.get("GROQ_API_KEY")
        return _call_openai_compatible(GROQ_URL, api_key, model_name,
                                       messages, stream, timeout=timeout)

    elif model_id.startswith("openrouter/"):
        model_name = model_id[len("openrouter/"):]
        api_key = (os.environ.get("OPENROUTER_API_KEY")
                   or os.environ.get("OPEN_ROUTER_API_KEY"))
        return _call_openai_compatible(OPENROUTER_URL, api_key, model_name,
                                       messages, stream, timeout=timeout)

    elif model_id.startswith("gemini/"):
        model_name = model_id[len("gemini/"):]
        api_key = os.environ.get("GEMINI_API_KEY")
        return _call_gemini(api_key, model_name, messages, stream, timeout=timeout)

    else:
        raise ValueError(f"Unknown provider prefix in model: {model_id}")
