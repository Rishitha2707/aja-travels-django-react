from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Bus(models.Model):
    bus_name = models.CharField(max_length=100)
    number = models.CharField(max_length=20, unique=True)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    features = models.TextField()
    no_of_seats = models.PositiveBigIntegerField()
    start_time = models.TimeField()
    reach_time = models.TimeField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL of the bus image")

    def __str__(self):
        return f"{self.bus_name},{self.number},{self.origin},{self.destination},{self.features},{self.start_time},{self.reach_time},{self.price}"

class Seat(models.Model):
    bus = models.ForeignKey(Bus,on_delete=models.CASCADE,related_name="seats")
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.bus},{self.seat_number},{self.is_booked}"
    

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    bus = models.ForeignKey(Bus,on_delete=models.CASCADE, related_name='bookings')
    seat = models.ForeignKey(Seat,on_delete=models.CASCADE, related_name='bookings')
    booking_time = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username}-{self.bus.bus_name}-{self.seat.seat_number}-{self.booking_time}"