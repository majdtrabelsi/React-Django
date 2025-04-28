from cryptography.fernet import Fernet


FERNET_KEY = b'GyCz8e93_GpkJtzrhIxbT3YCNZfK4pOZwr8m7DJ-_cs='
fernet = Fernet(FERNET_KEY)

def encrypt_value(value: str) -> str:
    return fernet.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    return fernet.decrypt(value.encode()).decode()


def is_user_allowed_in_chat(user, chat):
    full_name = f"{user.first_name} {user.last_name}".strip()
    return user.email == chat.name_person or user.email == chat.name_company or full_name == chat.name_person or full_name == chat.name_company
