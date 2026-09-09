from supabase import create_client, Client

url: str = "https://liwuqfpzqfsjrbpabfem.supabase.co/rest/v1."
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpd3VxZnB6cWZzanJicGFiZmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODkwMzMsImV4cCI6MjEwNDU2NTAzM30.OycTpLKGvOcpjxXNGG_q3WJ5oB8FgoWauA_tVrLEaUw"

supabase: Client = create_client(url, key)

try:
    test = supabase.table("posts").select("id").limit(1).execute()
    print("Connection successful! Sample data:", test.data)
except Exception as e:
    print("Connection failed:", e)