# Generated by Django 4.2.3 on 2023-07-22 11:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0006_comments_owner"),
    ]

    operations = [
        migrations.AddField(
            model_name="auction_listings",
            name="current_bid",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
