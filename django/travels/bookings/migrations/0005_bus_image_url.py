# Generated manually to add image_url field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0004_rename_user_booking_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='bus',
            name='image_url',
            field=models.URLField(blank=True, help_text='URL of the bus image', max_length=500, null=True),
        ),
    ]
