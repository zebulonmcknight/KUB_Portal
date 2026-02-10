import os
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_PUBLIC_KEY"))

if HF_TOKEN:= os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = HF_TOKEN

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def main():
    print(search_faq("Payment methods?"))

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
    query_embedding = embedder.encode(query).tolist()
    
    result = supabase.rpc("match_faq", {"query_embedding": query_embedding, "similarity_threshold": similarity_threshold, "num_match": num_match}).execute()
    
    return result.data

if __name__ == "__main__":
    main()