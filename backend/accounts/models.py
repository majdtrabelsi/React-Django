from django.contrib.auth.models import AbstractUser
from django.db import models
import pyotp
class User(AbstractUser):
    firstname = models.CharField(max_length=255, blank=True, null=True)
    lastname = models.CharField(max_length=255, blank=True, null=True)
    companyname = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    subscription_id = models.CharField(max_length=255, null=True, blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Change the related_name to avoid conflict
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Change the related_name to avoid conflict
        blank=True
    )
    is_2fa_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True, null=True)

    def get_totp_uri(self):
        if not self.two_factor_secret:
            return None
        return pyotp.TOTP(self.two_factor_secret).provisioning_uri(
            name=self.email,
            issuer_name="PFE-APP : "
        )

    def verify_otp(self, token):
        if not self.two_factor_secret:
            return False
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token)

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100,null=True, blank=True)
    #lastname = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="profile_pics/",null=True, blank=True)

    def __str__(self):
        return self.name


# partie el cv 



class Interest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interest_name = models.CharField(max_length=255)

    def __str__(self):
        return self.interest_name


class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    award_name = models.CharField(max_length=255)

    def __str__(self):
        return self.award_name
    


# offers/models.py

# models.py

class Offer(models.Model):
    user_name=models.CharField(max_length=255)
    name_company = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=255)
    hours = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class Portfolio(models.Model):
    user_name=models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title




from django.db import models

class Experience(models.Model):
    user_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date_ex = models.DateField(null=True, blank=True)  # Optional start date
    end_date_ex = models.DateField(null=True, blank=True)    # Optional end date

    def __str__(self):
        return self.title




from django.db import models

class Education(models.Model):
    user_name = models.CharField(max_length=255)
    school_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    description_ed = models.TextField(max_length=255)
    start_date_ed = models.DateField(null=True, blank=True)  # Optional start date
    end_date_ed = models.DateField(null=True, blank=True)    # Optional end date

    def __str__(self):
        return self.degree




from django.db import models

class Skill(models.Model):
    user_name = models.CharField(max_length=255)
    skill_name = models.CharField(max_length=255)
    proficiency = models.CharField(max_length=100)

    def __str__(self):
        return self.skill_name

class SocialMediaLink(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    twitch = models.URLField(blank=True, null=True)
    def __str__(self):
        return f"{self.user.username}'s Social Media Links"


from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BillingInfo(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='billing_info')
    encrypted_card_number = models.TextField(blank=True, null=True)
    encrypted_expiry = models.TextField(blank=True, null=True)  # MM/YY
    encrypted_cvv = models.TextField(blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def save_encrypted_card(self, card_number, expiry, cvv):
        from .utils import encrypt_value
        self.encrypted_card_number = encrypt_value(card_number)
        self.encrypted_expiry = encrypt_value(expiry)
        self.encrypted_cvv = encrypt_value(cvv)
        self.save()

    def card_last4(self):
        if not self.encrypted_card_number:
            return "****"
        from .utils import decrypt_value
        try:
            decrypted = decrypt_value(self.encrypted_card_number)
            return decrypted[-4:] if decrypted else "****"
        except:
            return "****"

    def expiry(self):
        if not self.encrypted_expiry:
            return None
        from .utils import decrypt_value
        try:
            return decrypt_value(self.encrypted_expiry)
        except:
            return None

    def has_card(self):
        return bool(self.encrypted_card_number)

    def __str__(self):
        return f"{self.user.username}'s billing info"


class BillingHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    status = models.CharField(max_length=50, default='paid')  # or 'failed', etc.
    stripe_invoice_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    stripe_invoice_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.description} - {self.amount}"


class Rqoffer(models.Model):
    name_person = models.CharField(max_length=255)
    name_company = models.CharField(max_length=255)
    id_offer = models.CharField(max_length=100)
    rp_offer = models.CharField(max_length=100, blank=True, default="")
    chat_closed = models.BooleanField(default=False)
    

    def __str__(self):
        return self.name_company
    
    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['name_person', 'id_offer'], name='unique_person_offer')
        ]


class ChatMessage(models.Model):
    offer = models.ForeignKey(Rqoffer, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} - {self.text[:20]}"

class ChatStatus(models.Model):
    offer = models.OneToOneField(Rqoffer, on_delete=models.CASCADE)
    chat_closed = models.BooleanField(default=False)
    typing_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
# community/models.py

# community/models.py
# community/models.py
# community/models.py

from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    name = models.CharField(max_length=100)
    message = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return f"{self.name} in {self.category.name}"


# community/models.py

class Reply(models.Model):
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='replies')
    name = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.name} on Post {self.post.id}"


class OneSignalPlayer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    player_id = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.user.username} - {self.player_id}"


class WorkProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    domain = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    description = models.TextField(blank=True) 

    def __str__(self):
        return f"{self.user.email} - {self.domain}/{self.specialty}"