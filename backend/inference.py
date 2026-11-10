
import threading

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"


class QwenService:
    def __init__(self):
        self.device = (
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_ID
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            dtype=(
                torch.float16
                if self.device == "cuda"
                else torch.float32
            ),
        ).to(self.device)

        self.model.eval()
        self.lock = threading.Lock()

    def generate(self, message: str) -> str:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful customer support AI. "
                    "Be clear and concise. "
                    "Do not invent company policies or prices."
                ),
            },
            {
                "role": "user",
                "content": message,
            },
        ]

        prompt = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = self.tokenizer(
            [prompt],
            return_tensors="pt",
            add_special_tokens=False,
        ).to(self.device)

        if inputs["input_ids"].shape[1] > 1024:
            raise ValueError("Input is too long")

        # Serialize inference for our small local demo.
        with self.lock, torch.inference_mode():
            output = self.model.generate(
                **inputs,
                max_new_tokens=160,
                do_sample=False,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        new_tokens = output[
            0, inputs["input_ids"].shape[1]:
        ]

        return self.tokenizer.decode(
            new_tokens,
            skip_special_tokens=True,
        ).strip()
