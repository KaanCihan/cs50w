# Generated by Django 4.2.3 on 2023-07-23 10:54

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0015_comments_author_comments_place_comments_text"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Comments",
        ),
    ]
