from rest_framework import serializers
from .models import Bus, Seat, Booking
from django.contrib.auth.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = "__all__"


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "seat_number", "is_booked"]


class BookingSerializer(serializers.ModelSerializer):
    bus = BusSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Booking
        fields = ["id", "user", "bus", "seat", "booking_time"]