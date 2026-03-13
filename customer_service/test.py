import requests
import time

start = time.time()

response = requests.post(
    "http://localhost:8000/chat",
    json={"question": "How do I pay my bill?"})

end = time.time()

print(response.json()["response"])
print(f"Response time: {end - start:.2f} seconds")