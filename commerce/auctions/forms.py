from django import forms
from .models import *
 
class ListingForm(forms.ModelForm):

    class Meta:
        model = Auction_listings
        fields = ["name", "current_bid", "img"]