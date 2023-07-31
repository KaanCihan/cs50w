from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError 

class User(AbstractUser):
    pass


class Auction_listings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=64)
    current_bid = models.IntegerField(default=0)    
    img = models.ImageField(upload_to='images/',default=None)

    def __str__(self) -> str:
        return f"Code: {self.code} Name: {self.name}"
    


class Bid(models.Model):
    auction = models.ForeignKey(Auction_listings, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=10, blank=True)
  
    def __str__(self):
        return f"Placer: {self.who_place}, Amount: {self.amount}, Placed on: {self.placed_bit}"


class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auction = models.ForeignKey(Auction_listings, on_delete=models.CASCADE)
    text = models.TextField(max_length=128, blank=True)
