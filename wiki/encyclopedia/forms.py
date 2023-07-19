from django import forms

class NewContentForm(forms.Form):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'size':'50'}))
    content = forms.CharField(label="Content", widget=forms.Textarea(attrs={'size':'100', 'rows' : '30'}))

class EditContentForm(forms.Form):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'size':'50'}))
    content = forms.CharField(label="Content", widget=forms.Textarea(attrs={'size':'100', 'rows' : '30'}))

