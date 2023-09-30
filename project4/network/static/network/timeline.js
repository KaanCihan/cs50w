document.addEventListener("DOMContentLoaded", function() {
    

    document.querySelector('#click-allposts').addEventListener('click', () => load_timeline('allposts'));
    document.querySelector('#click-username').addEventListener('click', () => {
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
        let postPage = 1;
        const timelineElement = document.querySelector('#timeline');    
        timelineElement.style.display = 'block';
        timelineElement.innerHTML = '';

        window.addEventListener("scroll", (event) => {
            let scroll = this.scrollY;
        });

        fetch(`/posts/${timeline}`)
            .then(response => response.json())
            .then(data => {
                var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]');

                const posts = data.postArray;
                pageNumber = Math.ceil(posts.length / 5);
                console.log(pageNumber)

                let title = document.createElement("h1");
                title.textContent = timeline.charAt(0).toUpperCase() + timeline.slice(1)
                title.style.marginBottom = "20px";

                if (timeline != data.user && timeline != "allposts" && timeline != "following"){
                    const followButton = document.createElement('button');
                    followButton.className = "btn btn-outline-info";

                    follow_unfollow(data.user, timeline, followButton);
                        
                    followButton.style.fontSize = "15px";
                    followButton.style.marginLeft = "30px";
                    followButton.style.padding = "3px";
                    
                    title.appendChild(followButton);

                    followButton.addEventListener('click', function () {
                        
                        fetch(`/posts/${data.user}/${timeline}`, {
                        method: 'PUT',
                        headers: {
                            'X-CSRFToken': `${csrfToken.value}`,
                            'Content-Type': 'application/json'
                        },
                        }).then(response => {
                            if (response.status === 204) {
                                console.log('Followed or unfollowed successfully');
                            } else {
                                console.error('Failed to follow');
                            }
                            follow_unfollow(data.user, timeline, followButton);
                        }).catch(error => {
                            console.error('An error occurred:', error);
                        });
                    });
                }
                document.querySelector('#timeline').append(title);
                
                
                const currentDate = new Date();

                const options = { year: 'numeric', month: 'numeric', day: 'numeric', 
                hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,};

                const formattedDate = currentDate.toLocaleDateString('en-US', options);
                console.log(formattedDate);
                var parts1 = formattedDate.split(',');

                

                let loading = false;

                window.addEventListener("scroll", function () {
                    if (loading) {
                        return; 
                    }

                    const windowHeight = window.innerHeight;
                    const scrollY = window.scrollY;
                    const documentHeight = document.documentElement.scrollHeight;


                    if (windowHeight + scrollY >= documentHeight - 200) {
                        loading = true; 
                        print_post(posts, parts1, data, postPage);
                        
                        if (postPage == pageNumber) {
                            loading = true;
                        } else {
                            loading = false;
                        }
                        postPage++;
                        console.log(postPage)
                    }
                });

                print_post(posts, parts1, data, postPage);
                postPage++;
               
                
                
                

                document.querySelectorAll('.username-a').forEach(function(anchor) {
                    anchor.onclick = function() {
                        const poster = anchor.getAttribute('data-username');
                        load_timeline(poster);
                    }
                });

                
            });

    }

});

function timeToSeconds(timeStr){
    var parts = timeStr.split(':');
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

function secondsToTime(secondss){
    var hours = Math.floor(secondss/3600);
    var minutes = Math.floor((secondss % 3600) / 60);
    var seconds = secondss % 60;

    return hours + ',' + minutes + ',' + seconds;
}

function follow_unfollow(user, timeline, followButton){
    fetch(`/posts/${user}/${timeline}`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': 'WbcFAtiFgqoeKdR5SZlN5ovxjJTicdU5M878zbVdT3sZwC7ghGSKD88LEl4BtfAw',
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { 
            return response.json();
        } else {
            throw new Error('Request failed with status: ' + response.status);
        }
    })
    .then(data => {
        console.log(data.relationship);
        if (data.relationship) {
            followButton.innerHTML = "unfollow";
            followButton.id = "unfollow";
        } else {
            followButton.innerHTML = "follow";
            followButton.id = 'follow';
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
}

function like_unlike(user, id, likeButton){
    fetch(`/posts/${user}/${id}/like`, {
        method: "GET",
        headers: {
            'X-CSRFToken': `${csrfToken.value}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) { 
            return response.json();
        } else {
            throw new Error('Request failed with status: ' + response.status);
        }
    }).then(data => {
        if (data.liked_or_not){
            likeButton.appendChild()
        }
    });
}

function print_post(posts, parts1, data, postPage, csrfToken){
    var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]');
    console.log(postPage);
    let c = postPage * 5;
    if (c > posts.length){
        c = posts.length;
    }
    const x = (postPage * 5) - 5;
    console.log(x);
    console.log(c);
    for (let i = x; i < c; i++){
        const emptyLike = document.createElement('img');
        const like = document.createElement('img');

        emptyLike.src = emptyHeart;
        like.src = heart;

        const posterr = document.createElement('a');
        posterr.setAttribute('href', 'javascript:;');
        posterr.setAttribute('data-username', posts[i].poster)
        posterr.style.fontWeight = 'bold';
        posterr.className = "username-a";
        posterr.innerHTML = posts[i].poster;
        
        posterr.classList.add('username-a');
        
        const body = document.createElement('span');
        body.innerHTML = posts[i].body;
        body.className = "post-body";
        
        const post = document.createElement('div'); 
        
        const parts2 = posts[i].timestamp.split(',');
        var stamp;
        if (parts2[0] == parts1[0]){
            var difference = timeToSeconds(parts1[1]) - timeToSeconds(parts2[1]);
            if (difference < 60){
                stamp = difference + ' seconds ago';
            } else if (difference < 3600) {
                stamp = Math.floor(difference / 60) + ' minutes ago';
            } else {
                stamp = Math.floor(difference / 3600) + ' hours ago';
            }

            console.log(secondsToTime(difference));
            var posted_ago = 0; 
        } else {
            stamp = posts[i].timestamp;
        }

        const time = document.createElement('span');
        time.innerHTML = stamp;

        const likeButton = document.createElement('button');
        
        like.style.width = "15px";
        emptyLike.style.width = "15px";
        likeButton.className = "btn btn-outline-danger";
        likeButton.style.padding = "0px";
        likeButton.style.paddingRight = "5px";
        likeButton.style.paddingLeft = "5px";
        likeButton.style.margin = "10px";
        likeButton.id = posts[i].id;

        fetch(`/posts/${data.user}/${posts[i].id}/like`, {
            method: "GET",
            headers: {
                'X-CSRFToken': `${csrfToken.value}`,
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())   
        .then(data => {
            if (data.liked_or_not){
                likeButton.appendChild(like);
            } else {
                likeButton.appendChild(emptyLike);
            }
        });


        
        
        post.style.marginBottom = "50px";
        post.classList.add('post-style');
        post.id = posts[i].id;

        post.appendChild(posterr);
        if (posts[i].poster == data.user){
            const buttonEdit = document.createElement('button');
            buttonEdit.className = 'edit-button';
            buttonEdit.style.marginLeft = '10px';
            buttonEdit.innerHTML = 'edit post';
            post.appendChild(buttonEdit)
        }
        

        post.appendChild(document.createElement('br'));
        post.appendChild(body);
        post.appendChild(document.createElement('br'));
        post.appendChild(time);
        post.appendChild(likeButton);
        
        document.querySelector('#timeline').append(post);

        document.querySelectorAll('.edit-button').forEach(function(button) {
            button.onclick = function() {
                button.disabled = true;
                var clickedButton = this;
                let parentPost = clickedButton.parentNode;
                const postId = parentPost.id;
                const spanElement = parentPost.querySelector('.post-body').textContent;

                console.log(parentPost.querySelector('.post-body'));
                console.log(spanElement);
                console.log(parentPost);

                const textarea = document.createElement('textarea');
                textarea.value = spanElement;

                
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'btn btn-success save-button';

                parentPost.querySelector('.post-body').innerHTML = '';
                parentPost.appendChild(textarea);
                parentPost.appendChild(saveButton);

                saveButton.onclick = function() {
                    parentPost.querySelector('.post-body').innerHTML = textarea.value;
                    const updatedBody = textarea.value;

                    fetch(`/update/${parentPost.id}`, {
                        method: 'PUT',
                        headers: {
                            'X-CSRFToken': `${csrfToken.value}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            body: updatedBody
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        button.disabled = false;
                        console.log(result);
                    });
                    parentPost.removeChild(saveButton);
                    parentPost.removeChild(textarea);
                }

            }
        });

        document.querySelectorAll('.btn.btn-outline-danger').forEach(function(button) {
            button.onclick = function() {
                
                console.log(document.scrollHeight);

                const emptyLike = document.createElement('img');
                const like = document.createElement('img');

                console.log(scroll);

                emptyLike.src = emptyHeart;
                like.src = heart;
                like.style.width = "15px";
                emptyLike.style.width = "15px";
                fetch(`/posts/${data.user}/${this.id}/like`, {
                    method: "POST",
                    headers: {
                        'X-CSRFToken': `${csrfToken.value}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())   
                .then(data => {
                    button.innerHTML = '';
                    if (data.liked_or_not){
                        button.appendChild(like);
                    } else {
                        button.appendChild(emptyLike);
                    }
                });
            }
        });
        
    }
}