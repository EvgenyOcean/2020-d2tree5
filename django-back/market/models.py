from django.db import models
from django.db.models.signals import post_save
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

    def __str__(self):
        return self.name


class Position(models.Model):
    name = models.CharField(max_length=150)
    okpd2 = models.CharField(max_length=20)
    okei = models.PositiveSmallIntegerField()
    amount = models.PositiveIntegerField()
    request = models.ForeignKey(Request, related_name='positions', on_delete=models.CASCADE)

    def __str__(self):
        return f'[{self.request.name}] - {self.name}'


class ChangeHistory(models.Model):
    stage = models.CharField(
        max_length=10, 
        choices=StageChoices.choices,
        default=StageChoices.CREATED,
    )
    date_created = models.DateTimeField(auto_now_add=True)
    position = models.ForeignKey(Position, related_name='changes', on_delete=models.CASCADE)
    executor = models.ForeignKey(Executor, related_name='+', 
                                on_delete=models.CASCADE, null=True, blank=True)
    resolution = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(stage__in=StageChoices.values), name="%(app_label)s_%(class)s_stage_valid"
            )
        ]
    
    def __str__(self):
        return f'[{self.position.name}] - {self.stage}'


class Payment(models.Model):
    executor = models.ForeignKey(Executor, related_name="executors", on_delete=models.CASCADE)
    position = models.ForeignKey(Position, related_name="positions", on_delete=models.CASCADE)
    gmp = models.PositiveIntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f'[{self.executor}] - {self.position}'


def create_history(sender, instance, created, **kwargs):
    if created:
        ChangeHistory.objects.create(position=instance)

post_save.connect(create_history, sender=Position)