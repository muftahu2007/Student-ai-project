# 🧠 AI Engineering & LLM Fine-Tuning Roadmap
### From AI Theory → Custom Fine-Tuned Model Deployment
*Tailored for building custom AI models for BUK Scholar AI*

---

## 📌 Executive Summary & Final Goal
**Goal:** Build a complete conceptual foundation in Machine Learning & LLMs, learn dataset engineering, fine-tune open-weights models (Llama 3 / Qwen 2.5) using QLoRA, quantize them, and deploy your custom-tuned model into your BUK Scholar AI platform.

---

## 🗓️ Phase-by-Phase Roadmap

### 🟢 PHASE 1 — Theoretical Foundations & LLM Mechanics (Weeks 1–2)

**Goal:** Understand how Large Language Models think, store knowledge, and process text under the hood before touching complex training scripts.

#### 📖 What to Learn:
- What is a Neural Network? (Inputs, Layers, Weights, Biases, Activation Functions).
- What are Model Parameters? (What 1B, 3B, or 8B parameters actually mean).
- Tokenization & Vocabulary (How text becomes numbers/tensors).
- The Transformer Architecture (Self-Attention Mechanism, Context Windows, Temperature).
- The LLM Training Pipeline: **Pre-training → Supervised Fine-Tuning (SFT) → RLHF/DPO Alignment**.

#### 📚 Free Study Resources:
1. **Video:** Andrej Karpathy — *"Intro to Large Language Models"* (YouTube).
2. **Interactive Site:** [Hugging Face NLP Course (Chapters 1 & 2)](https://huggingface.co/learn/nlp-course/chapter1/1).
3. **Short Course:** DeepLearning.AI — *"Generative AI with Large Language Models"*.

#### 🎯 Phase 1 Milestone / Project:
- **Tokenizer Lab:** Write a 10-line Python script that tokenizes custom text, inspects vocabulary IDs, and decodes them back to words.

---

### 🟡 PHASE 2 — Data Engineering & Instruction Formatting (Weeks 3–4)

**Goal:** Learn how to create, clean, and format high-quality instruction datasets for fine-tuning.

#### 📖 What to Learn:
- The golden rule of AI: **Quality Data > Quantity of Data**.
- Instruction Tuning formats: `JSONL` structure with System, User, and Assistant roles.
- Chat Templates: ChatML format vs. Llama-3 instruction tags (`<|start_header_id|>...`).
- Dataset processing using `pandas` and Hugging Face `datasets`.

#### 🎯 Phase 2 Milestone / Project:
- **Project 1 — BUK Instruction Dataset:** Build a clean `buk_knowledge_dataset.jsonl` containing 100+ high-quality instruction pairs (BUK course FAQs, grading guidelines, and study advice).

---

### 🔵 PHASE 3 — Fine-Tuning Open LLMs with PEFT & QLoRA (Weeks 5–7)

**Goal:** Train your first custom open-weights model using Parameter-Efficient Fine-Tuning on cloud GPUs.

#### 📖 What to Learn:
- Full Fine-Tuning vs. Parameter-Efficient Fine-Tuning (PEFT).
- **LoRA (Low-Rank Adaptation):** Freezing 99% of weights and training rank matrices (`r`, `lora_alpha`).
- **QLoRA:** 4-bit NormalFloat quantization to fit models inside free Google Colab GPUs.
- Training hyper-parameters: Learning Rate, Epochs, Batch Size, Gradient Accumulation, Warmup Steps.
- Training tools: **Unsloth**, Hugging Face `trl` (`SFTTrainer`), `peft`, `bitsandbytes`.

#### 📚 Free Study Resources:
1. **Documentation & Notebooks:** [Unsloth AI Guides](https://unsloth.ai).
2. **Tutorial:** Hugging Face Fine-Tuning Guide for LLMs.

#### 🎯 Phase 3 Milestone / Project:
- **Project 2 — Custom BUK Model Training:** Fine-tune `Qwen-2.5-1.5B` or `Llama-3.2-1B` on your BUK dataset using Unsloth in Google Colab. Plot the Loss Curve showing training progress.

---

### 🟣 PHASE 4 — Model Evaluation, Quantization & Local Serving (Weeks 8–9)

**Goal:** Evaluate your tuned model, compress it into GGUF format, and run it locally on your computer.

#### 📖 What to Learn:
- Model Evaluation: Training Loss vs. Validation Loss, Perplexity, Human Evaluation, LLM-as-a-Judge.
- Adapter Merging: Fusing LoRA weights back into the base model.
- Model Quantization: Converting FP16 weights into GGUF (4-bit/8-bit) using `llama.cpp`.
- Local Inference Engines: **Ollama** and **vLLM**.

#### 🎯 Phase 4 Milestone / Project:
- **Project 3 — Local Model Host:** Convert your fine-tuned model into GGUF format, load it into **Ollama**, and test prompting it from your local computer terminal offline.

---

### 🏆 PHASE 5 — Full-Stack AI Integration (Weeks 10–12)

**Goal:** Connect your self-hosted fine-tuned AI model into your BUK Scholar AI Django backend and React frontend.

#### 📖 What to Learn:
- Serving an Ollama / vLLM local endpoint as an API.
- Replacing external commercial API calls (Gemini/Groq) with your self-hosted model endpoint in Django.
- Streaming responses from your custom model to the React frontend.
- Performance benchmarking: Latency (Tokens per second) and VRAM usage.

#### 🎯 Phase 5 Final Capstone Project:
- **BUK Custom AI Engine:** A fully functioning full-stack application (Django + React) powered by **YOUR OWN custom fine-tuned model** running on your backend infrastructure!

---

## 🎓 Summary of What You Will Achieve at the End

| Capability | What You Will Be Able to Do |
|---|---|
| **Deep Understanding** | Explain exactly how neural networks, attention, loss, and tokenizers work under the hood. |
| **Data Mastery** | Prepare, clean, and format custom datasets for any domain (education, finance, legal, local languages). |
| **Fine-Tuning Expertise** | Fine-tune small to medium LLMs (1B to 8B) on Google Colab or cloud GPUs using QLoRA & Unsloth. |
| **Model Deployment** | Quantize models to GGUF and host them on Ollama, vLLM, or cloud servers. |
| **Full-Stack AI Synergy** | Connect your custom AI model directly into React/Django full-stack applications. |
