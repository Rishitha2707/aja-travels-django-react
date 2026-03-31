from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    BusListCreateView,
    BusDetailView,
    BookingView,
    UserBookingView,
    BusSeatsView,
    AdminDashboardView,
    AdminAllBookingsView,
    AdminBusManagementView,
    AdminBusDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('buses/', BusListCreateView.as_view(), name='bus-list'),
    path('buses/<int:pk>/', BusDetailView.as_view(), name='bus-detail'),
    path('buses/<int:bus_id>/seats/', BusSeatsView.as_view(), name='bus-seats'),
    path('bookings/', BookingView.as_view(), name='booking-create'),
    path('users/<int:user_id>/bookings/', UserBookingView.as_view(), name='user-bookings'),
    # Admin endpoints
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/bookings/', AdminAllBookingsView.as_view(), name='admin-all-bookings'),
    path('admin/buses/', AdminBusManagementView.as_view(), name='admin-bus-management'),
    path('admin/buses/<int:bus_id>/', AdminBusDetailView.as_view(), name='admin-bus-detail'),
]
