from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, Room_typesSet, ServiceSet, BookingViewSet, BookingServiceViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'room_types', Room_typesSet, basename='room_type')
router.register(r'services', ServiceSet, basename='service')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'booking_service', BookingServiceViewSet, basename='booking_service')

urlpatterns = [
    path('', include(router.urls)),
]