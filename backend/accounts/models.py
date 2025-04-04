from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    firstname = models.CharField(max_length=255, blank=True, null=True)
    lastname = models.CharField(max_length=255, blank=True, null=True)
    companyname = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)


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
    title = models.CharField(max_length=255)
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