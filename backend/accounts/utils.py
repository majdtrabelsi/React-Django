from cryptography.fernet import Fernet

# Use a constant key for now, store securely later (e.g. env var)
FERNET_KEY = b'GyCz8e93_GpkJtzrhIxbT3YCNZfK4pOZwr8m7DJ-_cs='  # must be a bytes object
fernet = Fernet(FERNET_KEY)

def encrypt_value(value: str) -> str:
    return fernet.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    return fernet.decrypt(value.encode()).decode()
