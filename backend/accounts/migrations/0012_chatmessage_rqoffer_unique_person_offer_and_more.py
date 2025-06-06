# Generated by Django 5.1.6 on 2025-04-16 16:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_merge_20250416_1623'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddConstraint(
            model_name='rqoffer',
            constraint=models.UniqueConstraint(fields=('name_person', 'id_offer'), name='unique_person_offer'),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='offer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.rqoffer'),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
