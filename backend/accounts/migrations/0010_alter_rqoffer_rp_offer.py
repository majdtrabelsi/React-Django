# Generated by Django 5.1.7 on 2025-04-14 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_remove_offer_people'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rqoffer',
            name='rp_offer',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
