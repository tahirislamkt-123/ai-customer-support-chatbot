
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from backend.inference import QwenService


service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global service

    # Load model once when the API starts
    service = QwenService()

    yield

    service = None


app = FastAPI(
    title="AI Customer Support API",
    version="0.1.0",
    lifespan=lifespan,
)


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000
    )


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if service is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not ready",
        )

    try:
        answer = service.generate(request.message)
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Message exceeds token limit",
        )

    return ChatResponse(reply=answer)
