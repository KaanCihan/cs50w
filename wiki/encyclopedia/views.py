from django.shortcuts import render, redirect
import random
from markdown2 import Markdown
from . import util, forms
from django.urls import path
from django.http import HttpResponse, HttpResponseRedirect


def index(request):
    query = request.GET.get("q")  # Get the search query from the URL parameter 'q'
    all_entries = len(util.list_entries())
    if query:
        # Perform a case-insensitive search for entries that match the query
        entries = [
            entry for entry in util.list_entries() if query.lower() in entry.lower()
        ]
    else:
        entries = util.list_entries()

    return render(
        request,
        "encyclopedia/index.html",
        {
            "entries": entries,
            "query": query,  # Pass the query to the template to display in the search input field
            "all_entries": all_entries,
            "entry_count": len(entries),
        },
    )


def create_page(request):
    if request.method == "POST":
        form = forms.NewContentForm(request.POST)
        if form.is_valid():
            stitle = form.cleaned_data["title"]
            scontent = form.cleaned_data["content"]
            for entry in util.list_entries():
                if entry == stitle:
                    return HttpResponse("page title already exists")

            util.save_entry(stitle, scontent)
            return HttpResponseRedirect(f"/wiki/{stitle}")

    return render(request, "encyclopedia/create.html", {"form": forms.NewContentForm()})


def edit_page(request, title):
    existing_markdown_content = util.get_entry(title)

    if request.method == 'POST':
        form = forms.EditContentForm(request.POST)
        if form.is_valid():
            util.save_entry(title, form.cleaned_data['content'])
            return HttpResponseRedirect(f"/wiki/{title}")
           
    else:
        form = forms.EditContentForm(initial={'title': title, 'content': existing_markdown_content})

    return render(request, 'encyclopedia/edit.html', {'form': form})

'''
def edit_page(request, title):
    if request.method == "POST":
        form = forms.NewContentForm(request.POST)
        if form.is_valid():
            stitle = form.cleaned_data["title"]
            scontent = form.cleaned_data["content"]
            content = util.get_entry(title)
            for entry in util.list_entries():
                if entry == stitle:
                    return HttpResponse("page title already exists")

            util.save_entry(stitle, scontent)
            return HttpResponseRedirect(f"wiki/{stitle}")

    return render(request, "encyclopedia/edit.html", {"form": forms.EditContentForm(), "Markdown": util.get_entry(title)})
'''


def random_page(request):
    entries = util.list_entries()
    randompage = random.choice(entries)

    return redirect(f"wiki/{randompage}")


def wiki_page(request, title):
    page = Markdown().convert(util.get_entry(title))

    return render(
        request,
        "encyclopedia/wikipage.html",
        {"title": title, "content": page},
    )
