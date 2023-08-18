# Generated by Django 4.2.3 on 2023-08-17 11:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("network", "0003_rename_sender_post_poster"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="followers",
            field=models.ManyToManyField(
                blank=True, related_name="followed_by", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="follow",
            name="followed",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="followers_actions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="follow",
            name="follower",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="following_actions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
