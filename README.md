<<<<<<< HEAD
# AI Customer Support Chatbot

A learning-focused LLM customer-support chatbot built using **Qwen2.5-0.5B-Instruct**, Python, Hugging Face Transformers, and Gradio.

## Current status
Milestone 1 — Colab inference prototype. **Not yet verified on the user’s runtime.**

## Quick start
1. Open `notebooks/01_qwen_colab.ipynb` in Google Colab.
2. Select a GPU runtime if available. CPU is supported but slower.
3. Run cells in order. First check the `AI response:` result.
4. Only then launch the optional Gradio demo.

## Learning objectives
- Distinguish a pretrained model from model inference.
- Understand chat templates and tokenization.
- Generate and decode tokens using PyTorch and Transformers.
- Manage short-term chat context.
- Test model output separately from the user interface.

## Architecture (initial)
`User -> Gradio -> Python generate_reply() -> Tokenizer -> Qwen -> Decoded response`

## Roadmap
- [ ] Verify Colab inference
- [ ] Test Gradio conversational responses
- [ ] Add tests and evaluation examples
- [ ] Extract Python inference service to FastAPI
- [ ] Build original Next.js interface
- [ ] Add storage, logging, and deployment documentation

## Known limitations
- Small model: output quality may be inconsistent.
- No retrieval from verified company knowledge.
- No permanent memory or customer data storage.
- A Colab session is not a production deployment.
- Do not use real customer data or secrets in public demos.

## Licence
Project source licence not yet chosen. Check model licence independently.
=======
# ai-customer-support-chatbot
AI-powered customer support chatbot built with Python, Qwen, Hugging Face Transformers, FastAPI and Next.js.
>>>>>>> origin/main
