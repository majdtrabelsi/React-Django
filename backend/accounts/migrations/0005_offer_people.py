# Generated by Django 5.1.7 on 2025-04-06 20:23

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_offer_person'),
    ]

    operations = [
        migrations.AddField(
            model_name='offer',
            name='people',
            field=models.ManyToManyField(related_name='offers_taken', to=settings.AUTH_USER_MODEL),
        ),
    ]
