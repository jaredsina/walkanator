from ollama import chat
nameInput = ""

with open("test.txt") as f:
    nameInput = f.read()

response = chat(
    
    model="minicpm-v4.6:1b",
    messages = [
        {
            "role":"user",
            "content":f"what is a {nameInput}, write a paragraph?"
        }
    ]
    
)

print(response.message.content)


