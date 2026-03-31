from django.contrib import admin
from bookings.models import Bus, Seat, Booking
# Register your models here.

@admin.register(Bus)
class Busadmin(admin.ModelAdmin):
    list_display = ("bus_name","number","origin","destination","start_time","reach_time","price","no_of_seats","image_url")
    list_filter = ("origin","destination")
    search_fields = ("bus_name","number","origin","destination")
    ordering = ("bus_name",)
    fieldsets = (
        ('Basic Information', {
            'fields': ('bus_name', 'number', 'origin', 'destination')
        }),
        ('Schedule', {
            'fields': ('start_time', 'reach_time')
        }),
        ('Details', {
            'fields': ('features', 'no_of_seats', 'price', 'image_url')
        }),
    )

@admin.register(Seat)
class Seatadmin(admin.ModelAdmin):
    list_display=("bus","seat_number","is_booked")
    list_filter = ("is_booked","bus")
    search_fields = ("bus__bus_name","seat_number")
    ordering = ("bus","seat_number")

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id","user", "bus", "seat", "booking_time")
    list_filter = ("booking_time", "bus")
    search_fields = ("user__username", "bus__bus_name", "seat__seat_number")
    readonly_fields = ("booking_time",)
    ordering = ("-booking_time",)
    date_hierarchy = "booking_time"