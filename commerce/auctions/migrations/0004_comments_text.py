# Generated by Django 4.2.3 on 2023-07-22 10:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0003_comments_bid"),
    ]

    operations = [
        migrations.AddField(
            model_name="comments",
            name="text",
            field=models.TextField(default="Comment...", max_length=128),
        ),
    ]