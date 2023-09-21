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

        fetch(`/posts/${timeline}`)
            .then(response => response.json())
            .then(data => {
                const posts = data.postArray;
                
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
                            'X-CSRFToken': 'WbcFAtiFgqoeKdR5SZlN5ovxjJTicdU5M878zbVdT3sZwC7ghGSKD88LEl4BtfAw',
                            'Content-Type': 'application/json'
                        },
                        }).then(response => {
                            if (response.status === 204) {
                                console.log('Followed successfully');
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
                
                // Print posts
                for (let i = 0; i < posts.length; i++){
                    
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

                    if (posts[i].poster == data.user){
                        const buttonEdit = document.createElement('button');
                        buttonEdit.innerHTML = 'edit';
                        post.appendChild(buttonEdit)
                    }

                    post.style.marginBottom = "50px";
                    post.classList.add('post-style');

                    post.appendChild(posterr);
                    post.appendChild(document.createElement('br'));
                    post.appendChild(body);
                    post.appendChild(document.createElement('br'));
                    post.appendChild(time);
                    
                    
                    document.querySelector('#timeline').append(post);
                }

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