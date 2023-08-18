document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email(null, null, null));

  // Toggle sent when submit
  document.querySelector('#compose-form').addEventListener('submit', function(event) {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    
    event.preventDefault(); // Preventing default, load the inbox
    load_mailbox('sent');
  });
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(recipients, subject, body) {
  if (recipients == null) {
    recipients = '';
  }
  
  if (subject == null) {
    subject = '';
  }

  if (body == null) {
    body = '';
  }
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-single').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out or Fill composition fields
  console.log(recipients);
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-single').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      for (let i = 0; i < emails.length; i++) {
        const element = document.createElement('div');

        let btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mail-btn";
        btn.id = emails[i].id;
        btn.innerHTML = "<b>Sender: " + emails[i].sender + " Subject: " + emails[i].subject + " Timestamp: " + emails[i].timestamp;
        btn.style.backgroundColor = emails[i].read ? "gray" : "white";
        element.appendChild(btn);
        
        if (mailbox !== "sent"){
          let btn2 = document.createElement("button");
          btn2.type = "button";
          btn2.className = "archive-btn";
          btn2.id = emails[i].id;
          if (mailbox === "inbox"){
            btn2.innerHTML = "archive";
          } else {
            btn2.innerHTML = "unarchive";
          }
          element.appendChild(btn2);
        }
        document.querySelector('#emails-view').append(element);
      }
      mailButton(mailbox);
      document.querySelector('#emails-single').style.display = 'none';
    });
}

function mailButton(mailbox) {
  
  document.querySelectorAll('.mail-btn').forEach(function(button) {
    button.onclick = function() {
      c = this.id;
      console.log(this.id);
      fetch(`/emails/${c}`)
      .then(response => response.json())
      .then(email => {
          
        document.querySelector('#emails-single').innerHTML = "Sender: " + email.sender + "<br>Subject: " + email.subject + 
        "<br>Body: " + email.body + "<br>Timestamp: " + email.timestamp + "   " + email.archived;

        
        let btn = document.createElement("button");
        btn.id = "reply";
        btn.className = "reply";
        btn.innerHTML = "reply";
        document.querySelector('#emails-single').append(btn);

        document.querySelector('.reply').addEventListener('click', () => {
          let text = `On ${email.timestamp} ${email.sender} wrote: \n`
          let compose_body = text + email.body;
          compose_email(email.recipients, email.subject, compose_body);
        });
      });
      

      document.querySelector('#emails-view').style.display = 'none';
  
      fetch(`/emails/${c}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
      document.querySelector('#emails-single').style.display = 'block';
    }

   
  });

  

  document.querySelectorAll('.archive-btn').forEach(function(button) {
    button.onclick = function() {

      const archiveStatus = mailbox === "inbox" ? true : false;
     
      fetch(`/emails/${this.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: archiveStatus
        })
      }).then(() =>load_mailbox('inbox'));
        
    }; 
  });
}