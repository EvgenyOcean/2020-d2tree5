# Generated by Django 3.1.4 on 2020-12-09 20:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0003_auto_20201205_1304'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='slug',
            field=models.SlugField(default='dude'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='changehistory',
            name='stage',
            field=models.CharField(choices=[('Created', 'Created'), ('Assigned', 'Assigned to the executer'), ('Paid', 'Payment issued'), ('Returned', 'Returned to the executor'), ('Canceled', 'Executor removed from payment'), ('Expired', 'Expired')], default='Created', max_length=10),
        ),
        migrations.AddConstraint(
            model_name='request',
            constraint=models.UniqueConstraint(fields=('slug', 'owner'), name='market_request_unique_owner_slug'),
        ),
    ]
