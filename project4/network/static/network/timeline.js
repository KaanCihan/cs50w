document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('#click-allposts').addEventListener('click', () => load_timeline('allposts'));
    document.querySelector('#click-username').addEventListener('click', () => {
        console.log('deneme');
        const data = document.querySelector('#click-username').getAttribute('data-username');
        load_timeline(data);
    });
    document.querySelector('#click-following').addEventListener('click', () => load_timeline('following'));
    load_timeline('allposts');

    document.querySelector('#post-post').addEventListener('submit', function() {
        const body = document.querySelector('#post-body').value;
        console.log('basari');
        fetch('/posts', {
            method: 'POST',
            body: JSON.stringify({
                body: body
            })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
    });

    function load_timeline(timeline) {
        const timelineElement = document.querySelector('#timeline');
        timelineElement.style.display = 'block';
        timelineElement.innerHTML = '';

        console.log('deneme');
        
        let title = document.createElement("h1");
        title.textContent = timeline.charAt(0).toUpperCase() + timeline.slice(1)
        title.style.margin = "10px";
        
        document.querySelector('#timeline').append(title);

        fetch(`/posts/${timeline}`)
            .then(response => response.json())
            .then(posts => {
                // Print posts
                for (let i = 0; i < posts.length; i++){
                    console.log(posts[i]);

                    const element = document.createElement('div');
                    const post = document.createElement('div');
                    
                    
                    post.innerHTML = '<span class="bold-poster" style="font-style: italic;">' + posts[i].poster +  '</span>' + "<br>" + posts[i].body + "<br>";
                    post.classList.add('post-style');
                    
                    element.appendChild(post);
                    element.style.marginBottom = "50px";
                    document.querySelector('#timeline').append(element);
                }
            })

    }

});
