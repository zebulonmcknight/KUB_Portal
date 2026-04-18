import os
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat

app = FastAPI()

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_PUBLIC_KEY"))

if HF_TOKEN:= os.getenv("HF_TOKEN"):
    os.environ['HF_TOKEN'] = HF_TOKEN

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

# System prompt for how LLM should act.
SYSTEM_PROMPT = """You are Energi, a Knoxville Utilities Board (KUB) customer service AI assistant.

When FAQ Context is provided, use it as your only source of facts. Do not introduce any information outside of it.
When NO FAQ Context is provided, you may only respond to greetings and farewells — keep it brief and friendly.
Be polite, concise, and professional.
Do not use any markdown formatting. Write in plain text only. For links, write the full URL as-is (e.g. https://www.kub.org/customer/forgot).
"""

# Just ensures that the HTTP request contains a string field named question.
class ChatRequest(BaseModel):
    question: str

def search_faq(query: str, similarity_threshold: float = 0.5, num_match: int = 1):
    """
    Uses rpc() to call match_faq query function to perform semantic vector search over the faq table's embedding 
    column using negative inner product to find AT MOST num_match entries that have a similarity >= similarity_threshold.

    Args:
        query: User's question text.
        similarity_threshold: Mininmum similarity score (default 0.5).
        num_match: Maximum number of matches to return (default 1).
        
    Returns:
        List of matching FAQ entries with similarity scores.
    """
    try:
        query_embedding = embedder.encode(query).tolist()
        result = supabase.rpc("match_faq", {"query_embedding": query_embedding, "similarity_threshold": similarity_threshold, "num_match": num_match}).execute()
        return result.data
    
    except Exception as e:
        return -1

def call_LLM(context:str, question: str):
    try:
        response = chat(
            model=OLLAMA_MODEL, 
            think=False,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"FAQ Context:\n{context}\n\nUser Question: \n{question}"}
            ]
        )
        return response.message.content
    
    except Exception as e:
        return "Energi is currently unavailable. Please call KUB support at (865) 524-2911"

def classify_and_expand(question: str) -> tuple[bool, str]:
    response = chat(
        model=OLLAMA_MODEL,
        think=False,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Do one of the following:\n"
                    f"1. If the message is a greeting (like what's up, hi, hello, and hey), farewell (like goodbye, cya, and bye), or pleasantry with no question or request for information, reply with exactly: GREETING\n"
                    f"2. Otherwise, rewrite it into a clear, complete question. Reply with only the rewritten question.\n\n"
                    f"Message: {question}"
                )
            }
        ]
    )
    result = response.message.content.strip()
    if result.upper() == "GREETING":
        return True, question
    return False, result

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        is_greeting, expanded = classify_and_expand(request.question) #Create an improved query question using the LLM so the search_faq fails less.
        
        if is_greeting:
            return {"response": call_LLM("", request.question)}

        matches = search_faq(expanded)  # Pass the expanded query.
                
        if matches == -1: # Could not access Supabase.
            return {"response": "We're currently experiencing technical difficulties with our database. Please call KUB support at (865) 524-2911"}
        
        if not matches: # No matches were made, so it is not in the FAQ table.
            return {"response": "Unfortunately, I don't have that information! If you would like to talk to a representative, please call KUB support at (865) 524-2911"}
        
        context = "\n\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in matches]) # This is in case we wish to get multiple matches.
        
        return {"response": call_LLM(context, request.question)}

    except Exception as e:
        return {"response": "Something went wrong. Please call KUB support at (865) 524-2911"}