document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('#click-allposts').addEventListener('click', () => load_timeline('allposts'));
    document.querySelector('#click-following').addEventListener('click', () => load_timeline('following'));
    load_timeline('allposts');
})

function load_timeline(timeline) {
    const timelineElement = document.querySelector('#timeline');
    timelineElement.style.display = 'block';
    timelineElement.innerHTML = '';

    console.log('deneme');
    const element = document.createElement('div');

    let title = document.createElement("h1");
    title.textContent = timeline.charAt(0).toUpperCase() + timeline.slice(1)
    document.querySelector('#timeline').append(title);

    fetch(`/posts/${timeline}`)
        .then(response => response.json())
        .then(posts => {
            // Print posts
            for (let i = 0; i < posts.length; i++){
                console.log(posts[i]);

                const post = document.createElement('div');

                post.innerHTML = posts[i].user +  "<br>" + posts[i].body + "<br>";

                document.querySelector('#timeline').append(post);
            }
        })
}
