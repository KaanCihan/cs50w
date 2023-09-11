from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

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

class UserFollowing(models.Model):
    user_id = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
    following_user_id = models.ForeignKey("User",on_delete=models.PROTECT, related_name="followers")

    follow_time = models.DateTimeField(auto_now_add=True)