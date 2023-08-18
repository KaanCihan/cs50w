from django import forms


class PostForm(forms.Form):
    your_name = forms.TextInput(label="Your name", max_length=100)