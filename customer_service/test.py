import requests
import time

start = time.time()

response = requests.post(
    "https://snappy-orville-leathern.ngrok-free.dev/chat",
    json={"question": "How pay bill?"})

end = time.time()

print(response.json()["response"])
print(f"Response time: {end - start:.2f} seconds")