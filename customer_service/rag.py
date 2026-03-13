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

Use the provdided FAQ Context as your only source of facts. Do not introduce facts or information outside of the provided context.
Be polite, concise, and professional.
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
        return "Energi is currently unavailable. Please call KUB support at 865-524-2911"

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        matches = search_faq(request.question)
        
        if matches == -1: # Could not access Supabase.
            return {"response": "We're currently experiencing technical difficulties with our database. Please call KUB support at 865-524-2911"}
        
        if not matches: # No matches were made, so it is not in the FAQ table.
            return {"response": "Unfortunately, I don't have that information! Would you like me to connect you with a representative?"}
        
        context = "\n\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in matches]) # This is in case we wish to get multiple matches.
        
        return {"response": call_LLM(context, request.question)}

    except Exception as e:
        return {"response": "Something went wrong. Please call KUB support at 865-524-2911"}