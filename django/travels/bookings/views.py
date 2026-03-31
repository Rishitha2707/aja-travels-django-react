#authicate, permission, token, status, response, generics, apiviews

from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework import status,generics
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer,BusSerializer,BookingSerializer,SeatSerializer
from rest_framework.response import Response
from .models import Bus,Seat,Booking
from django.db.models import Count, Sum
from django.utils import timezone


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token':token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token,created = Token.objects.get_or_create(user=user)
            return Response({
                'token':token.key,
                'user_id':user.id,
                'is_staff':user.is_staff
            },status=status.HTTP_200_OK)
        else:
            return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
        

class BusListCreateView(generics.ListAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class BusDetailView(generics.RetrieveUpdateAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        seat_id = request.data.get('seat')
        try:
            seat = Seat.objects.get(id = seat_id)
            if seat.is_booked:
                return Response({'error':'Seat already booked'},status=status.HTTP_400_BAD_REQUEST)
            
            seat.is_booked = True
            seat.save()

            booking = Booking.objects.create(
                user = request.user,
                bus = seat.bus,
                seat = seat
            )

            serializer = BookingSerializer(booking)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        except Seat.DoesNotExist:
            return Response({'error':'Invalid Seat ID'},status=status.HTTP_400_BAD_REQUEST)


class UserBookingView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,user_id):
        if request.user.id != user_id:
            return Response({'error':'Unauthorized'},status=status.HTTP_401_UNAUTHORIZED)
        
        bookings = Booking.objects.filter(user_id=user_id)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BusSeatsView(APIView):
    def get(self, request, bus_id):
        try:
            bus = Bus.objects.get(id=bus_id)
            seats = Seat.objects.filter(bus=bus)
            serializer = SeatSerializer(seats, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)


# Admin Views
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        total_buses = Bus.objects.count()
        total_bookings = Booking.objects.count()
        total_users = Booking.objects.values('user').distinct().count()
        total_revenue = Booking.objects.aggregate(
            total=Sum('bus__price')
        )['total'] or 0
        
        recent_bookings = Booking.objects.order_by('-booking_time')[:5]
        recent_bookings_serializer = BookingSerializer(recent_bookings, many=True)
        
        return Response({
            'total_buses': total_buses,
            'total_bookings': total_bookings,
            'total_users': total_users,
            'total_revenue': float(total_revenue),
            'recent_bookings': recent_bookings_serializer.data
        }, status=status.HTTP_200_OK)


class AdminAllBookingsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        bookings = Booking.objects.all().order_by('-booking_time')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminBusManagementView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        buses = Bus.objects.all()
        serializer = BusSerializer(buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = BusSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminBusDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, bus_id):
        try:
            bus = Bus.objects.get(id=bus_id)
            serializer = BusSerializer(bus)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, bus_id):
        try:
            bus = Bus.objects.get(id=bus_id)
            serializer = BusSerializer(bus, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, bus_id):
        try:
            bus = Bus.objects.get(id=bus_id)
            bus.delete()
            return Response({'message': 'Bus deleted successfully'}, status=status.HTTP_200_OK)
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)
    