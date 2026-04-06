import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "Helsinki-NLP/opus-mt-en-ne"
# model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, torch_dtype=torch.float16)
model.eval()

class TranslateRequest(BaseModel):
    text: str


@app.post("/translate")
def translate(req: TranslateRequest):
    with torch.no_grad():
        inputs = tokenizer(req.text, return_tensors="pt")
        translated = model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.convert_tokens_to_ids("npi_Deva"),
            max_length=400,
            no_repeat_ngram_size=3,
            num_beams=4,
            repetition_penalty=1.5,
            length_penalty=0.6,
        )
    result = tokenizer.batch_decode(translated, skip_special_tokens=True)[0]

    # Fix duplicate words for single-word inputs
    words = result.split()
    if len(req.text.split()) == 1:
        # Take only the last word (the Nepali script one)
        nepali_words = [w for w in words if any('\u0900' <= c <= '\u097F' for c in w)]
        if nepali_words:
            
            result = nepali_words[0]

    return {"translatedText": result}