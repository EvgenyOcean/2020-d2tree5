from django.db import models
from users.models import Customer, Executor

# Create your models here.
class StageChoices(models.TextChoices):
    CREATED = "Created", "Created"
    ASSIGNED = "Assigned", "Assigned to the executer",
    PAID = "Paid", "Payment issued",
    RETURNED = "Returned", "Returned to the executor",
    CANCELED = "Canceled", "executor removed from payment",
    EXPIRED = "Expired", "Expired"


class Request(models.Model):  
    name = models.CharField(max_length=150)
    date_created = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    owner = models.ForeignKey(Customer, related_name='requests', on_delete=models.CASCADE)


class Position(models.Model):
    name = models.CharField(max_length=150)
    okpd2 = models.CharField(max_length=20)
    okei = models.PositiveSmallIntegerField()
    amount = models.PositiveIntegerField()
    request = models.ForeignKey(Request, related_name='positions', on_delete=models.CASCADE)
    

class ChangeHistory(models.Model):
    stage = models.CharField(
        max_length=10, 
        choices=StageChoices.choices
    )
    date_created = models.DateTimeField(auto_now_add=True)
    position = models.ForeignKey(Position, related_name='changes', on_delete=models.CASCADE)
    executor = models.OneToOneField(Executor, on_delete=models.CASCADE)
    resolution = models.TextField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(stage__in=StageChoices.values), name="%(app_label)s_%(class)s_stage_valid"
            )
        ]


class Payment(models.Model):
    executor = models.ForeignKey(Executor, related_name="executors", on_delete=models.CASCADE)
    position = models.ForeignKey(Position, related_name="positions", on_delete=models.CASCADE)
    gmp = models.PositiveIntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
