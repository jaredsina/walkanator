"""from llama_cpp import Llama

llm = Llama(
    model="minicpm-v4.6:1b",
    chat_format="chatml"
    msgs = [
    {
        "role": "system",
        "content": "You are an information supplier. You are provided the name of a species of plant and you output information on that species."
    }
]

)
"""
 
from ollama import chat
nameInput = "common house spider"

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


