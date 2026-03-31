# Generated manually to fix field name

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_booking'),
    ]

    operations = [
        migrations.RenameField(
            model_name='booking',
            old_name='User',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='booking',
            name='bus',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='bookings.bus'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='seat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='bookings.seat'),
        ),
    ]
