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

import requests
from django.conf import settings

def send_onesignal_notification(player_id, title, message):
    headers = {
        "Authorization": f"Basic {settings.ONESIGNAL_REST_API_KEY}",
        "Content-Type": "application/json; charset=utf-8",
    }

    payload = {
        "app_id": settings.ONESIGNAL_APP_ID,
        "include_player_ids": [player_id],
        "headings": {"en": title},
        "contents": {"en": message},
    }

    response = requests.post(
        "https://onesignal.com/api/v1/notifications",
        headers=headers,
        json=payload,
    )

    return response.status_code, response.json()

