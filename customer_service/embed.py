import os
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

if HF_TOKEN:= os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = HF_TOKEN

embedder = SentenceTransformer("all-MiniLM-L6-v2")

FAQ_QUESTIONS = [
    {
        "question": "What payment methods are there?",
        "answer": "If you want to save time and effort in bill paying, you can set up AutoPay! If not, you may pay through the official KUB website, in the billing section of this app, pay via call using KUB's automated system by calling 865-524-2911 and following the prompts, pay at your bank (please check if your financial institution accepts KUB payments), or through mail.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I reset my password?",
        "answer": "To reset your password, please visit https://www.kub.org/customer/forgot and follow the instructions to receive a password reset link via email.",
        "embedding": [],
        "metadata": {},
    }
    
]

for faq in FAQ_QUESTIONS:
    # Embed the question + answer so it can capture questions that essentially ask the same thing in different phrasing. Convert to list (vector) for Supabase.
    faq['embedding'] = embedder.encode(faq['question'] + ' ' + faq['answer']).tolist()
    
    data = {"question": faq['question'], "answer": faq['answer'], "embedding": faq['embedding'], "metadata": faq['metadata']}
    
    supabase.table("faq").insert(data).execute()
    print(f"Inserted FAQ: {faq['question']}")
    
print("All FAQs embedded and inserted into Supabase.")