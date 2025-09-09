from rest_framework import viewsets, permissions
from .serializers import BookingServiceSerializer, RoomSerializer, Room_typeSerializer, ServiceSerializer, BookingSerializer
from .models import Rooms, Room_types, Service, Booking, Booking_service
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Rooms.objects.all()
    serializer_class = RoomSerializer
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get_queryset(self):
        return Rooms.objects.select_related('room_type')

class Room_typesSet(viewsets.ModelViewSet):
    queryset = Room_types.objects.all()
    serializer_class = Room_typeSerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    

class ServiceSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Разрешение для доступа владельца или администратора
    """
    def has_object_permission(self, request, view, obj):
        # Администратор имеет полный доступ
        if request.user.is_staff:
            return True
        # Владелец может просматривать только свои объекты
        return obj.user == request.user



class BookingServiceViewSet(viewsets.ModelViewSet):
    queryset = Booking_service.objects.all()
    serializer_class = BookingServiceSerializer
    permission_classes = [permissions.IsAdminUser]





class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)


    def perform_create(self, serializer):
        # Автоматически добавляем текущего пользователя при создании
        serializer.save(user=self.request.user)  # user устанавливается здесь




    def create(self, request, *args, **kwargs):



        serializer = self.get_serializer(data=request.data)  # Создаем сериализатор с данными запроса
        serializer.is_valid(raise_exception=True)  # Проверяем валидность данных (выбрасывает исключение при ошибке)
        
        # Вызываем метод create сериализатора для сохранения данных
        serializer.save()
        
        # Возвращаем ответ с данными созданного бронирования
        return Response(serializer.data, status=201)
