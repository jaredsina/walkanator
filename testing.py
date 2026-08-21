import requests

API_KEY = "YOUR_OPENROUTER_API_KEY"

url = "https://openrouter.ai/api/v1/chat/completions"

payload = {
    "model": "openrouter/free",
    "messages": [
        {
            "role": "user",
            "content": "Write a short paragraph describing the word galaxy."
        }
    ]
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 200:
    data = response.json()
    print(data["choices"][0]["message"]["content"])
else:
    print("Error:", response.status_code)
    print(response.text)