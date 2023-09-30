from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import UniqueConstraint


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    poster = models.ForeignKey(User, on_delete=models.PROTECT, related_name="poster")
    body = models.TextField()
    likes = models.ManyToManyField(User, related_name="likes")
    timestamp = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)

    def like_count(self):
        return self.likes.count()
    
    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "poster": self.poster.username,
            "timestamp": self.timestamp.strftime("%#m/%#d/%Y, %H:%M:%S"),
            #"followers": [follower.username for follower in self.user.followers.all()],
            "archived": self.archived
        }

class UserFollowing(models.Model):
    user_id = models.ForeignKey("User", on_delete=models.PROTECT, related_name="following")
    followed_user_id = models.ForeignKey("User",on_delete=models.CASCADE, null=True, related_name="followed")

    follow_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['user_id', 'followed_user_id'],
                name='unique_follow'
            ),

            models.CheckConstraint(
                check=~models.Q(user_id=models.F('followed_user_id')),
                name='self_follow_check'
            )
        ]
    
    def serialize(self):
        return {
            "id": self.id
        }

    