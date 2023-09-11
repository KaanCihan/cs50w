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

                    const posterr = document.createElement('a');
                    posterr.setAttribute('href', 'javascript:;');
                    posterr.setAttribute('data-username', posts[i].poster)
                    posterr.style.fontWeight = 'bold';
                    posterr.className = "username-a";
                    posterr.innerHTML = posts[i].poster;
                    posterr.classList.add('username-a');
                    
                    const body = document.createElement('span');
                    body.innerHTML = posts[i].body;
                    
                    const post = document.createElement('div');
                    post.style.marginBottom = "50px";
                    post.classList.add('post-style');
                    
                    post.appendChild(posterr);
                    post.appendChild(document.createElement('br'));
                    post.appendChild(body);
                    
                    
                    document.querySelector('#timeline').append(post);
                }

                document.querySelectorAll('.username-a').forEach(function(anchor) {
                    anchor.onclick = function() {
                        const poster = anchor.getAttribute('data-username');
                        load_timeline(poster);
                    }
                });
            })

    }

});
