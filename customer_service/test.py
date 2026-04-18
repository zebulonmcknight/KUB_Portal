import requests
import time

QUESTIONS = ["I'm moving, how do I set up utilities at my new place?",
"How do I cancel my KUB service?",
"I just bought a house, how do I get electricity turned on?",
"What do I need to transfer my service to a new address?",
"Can I start service online or do I have to come in person?",
"How much notice do I need to give to stop service?"]

for question in QUESTIONS:
    start = time.time()
    response = requests.post(
        "http://localhost:8000/chat",
        json={"question": question})
    
    end = time.time()

    print(f"Response time: {end - start:.2f} seconds")
    print(response.json()["response"])