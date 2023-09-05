from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", symmetrical=False, related_name='followed_by', blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    poster = models.ForeignKey(User, on_delete=models.PROTECT, related_name="poster")
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "poster": self.poster.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "followers": [follower.username for follower in self.user.followers.all()],
            "archived": self.archived
        }

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_actions")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers_actions")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')

