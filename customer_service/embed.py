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
        "answer": "If you want to save time and effort in bill paying, you can set up AutoPay! If not, you may pay through the official KUB website, in the billing section of this app, pay via call using KUB's automated system by calling (865) 524-2911 and following the prompts, pay at your bank (please check if your financial institution accepts KUB payments), or through mail.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I reset my password?",
        "answer": "To reset your password, please visit https://www.kub.org/customer/forgot and follow the instructions to receive a password reset link via email.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I report a power outage?",
        "answer": "You can report an outage online at https://www.kub.org/outage/report, or call (865) 524-2911 or +1 (800) 250-8068 at any time — 24/7 emergency service is available. When prompted, press 2-1 for electric outages. You can also check your outage status at https://www.kub.org/outage/my-status and view live outage maps at https://www.kub.org/outage/map.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I report a gas leak or emergency?",
        "answer": "Call (865) 524-2911 or +1 (800) 250-8068 immediately — this line is available 24 hours a day, 7 days a week. When the automated recording begins, press 1 for a natural gas leak or emergency. Do not use electrical switches or open flames near the suspected leak.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I start or stop KUB service?",
        "answer": "You can start or stop service online at https://www.kub.org/start-stop-service. You will need a new address, a valid email address, your desired start or stop date (allow at least one business day), and your Social Security Number. If a Social Security Number is not available, you must request service in person at a KUB Customer Service Center.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "What is the Levelized Billing Plan?",
        "answer": "KUB's Levelized Billing Plan (LBP) is a budget billing program that recalculates your monthly payment based on your most recent 12 months of usage history. This rolling average helps keep your bill more consistent, reducing large swings caused by seasonal weather. You can combine LBP with AutoPay for maximum convenience. Learn more at https://www.kub.org/bills-payments/billing-options/levelized-bill-plan.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I sign up for paperless billing?",
        "answer": "You can enroll in Paperless Billing through your KUB online account. Once enrolled, you'll receive an email or text message each month when your bill is ready to view online. You can still pay using any available payment method. Sign up or manage your preferences at https://www.kub.org/bills-payments/billing-options/paperless-billing.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I set up AutoPay?",
        "answer": "KUB offers two free automatic bank draft options. AutoPay automatically drafts your payment on the due date each month. SelectPay lets you choose any day before your bill is due to schedule the draft from your bank or credit union account. Both options are free and can be set up through your KUB online account.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I sign up for outage notifications?",
        "answer": "You can sign up for KUB outage notifications through your online account at https://www.kub.org/customer. Once enrolled, you'll receive alerts about electric outages affecting your address, including estimated restoration times as soon as they become available.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "What are KUB's customer service hours?",
        "answer": "KUB customer service representatives are available Monday through Friday, 7 a.m. to 6 p.m., for billing inquiries, service orders, and general questions. Call (865) 524-2911 and have your account number ready. For emergencies such as outages or gas leaks, the line is available 24 hours a day, 7 days a week.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How can I manage my account 24/7 without speaking to a representative?",
        "answer": "KUB's automated phone system is available around the clock. Call (865) 524-2911 or +1 (800) 250-8068 and follow the prompts to check your account balance, make a payment, or request a final notice due date extension. Have your KUB account number ready. The system supports both speech and Touch-Tone input, and is available in English and Spanish.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "Where are KUB's in-person customer service locations?",
        "answer": "KUB has in-person Customer Service Centers where you can pay your bill or speak with a representative. Locations include 445 S. Gay Street and 4428 Western Ave in Knoxville. You can view all payment locations and kiosks on the map at https://www.kub.org/bills-payments/payment-locations-map.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "What is the Round It Up program?",
        "answer": "Round It Up is an optional KUB program that automatically rounds your monthly bill up to the next dollar. The spare change is donated to help weatherize homes for low-income families, reducing their energy costs. You can enroll through your KUB account or learn more at https://www.kub.org/rounditup.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "How do I contact KUB?",
        "answer": "You can reach KUB by phone at (865) 524-2911 (Monday–Friday, 7 a.m.–6 p.m. for general inquiries; 24/7 for emergencies). You can also submit a message via the contact form at https://www.kub.org/about/contact-us, or email customerservice@kub.org. For TDD/TTY access, call (865) 594-7494.",
        "embedding": [],
        "metadata": {},
    },
    {
        "question": "Does KUB offer services in Spanish?",
        "answer": "Yes, KUB's automated phone system (865) 524-2911 is available in both English and Spanish. Spanish-language billing information is also available on the KUB website at https://www.kub.org/bills-payments/espanol.",
        "embedding": [],
        "metadata": {},
    },
]

for faq in FAQ_QUESTIONS:
    # Embed the question + answer so it can capture questions that essentially ask the same thing in different phrasing. Convert to list (vector) for Supabase.
    faq['embedding'] = embedder.encode(faq['question'] + ' ' + faq['answer']).tolist()
    
    data = {"question": faq['question'], "answer": faq['answer'], "embedding": faq['embedding'], "metadata": faq['metadata']}
    
    supabase.table("faq").insert(data).execute()
    print(f"Inserted FAQ: {faq['question']}")
    
print("All FAQs embedded and inserted into Supabase.")