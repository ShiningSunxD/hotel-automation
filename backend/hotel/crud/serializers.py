from django.forms import ValidationError
from rest_framework import serializers
from .models import Rooms, Room_types, Booking, Service, Booking_service



class BookingDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['check_in', 'check_out', 'status']



class RoomSerializer(serializers.ModelSerializer):

    bookings = BookingDatesSerializer(
        many=True,
        read_only=True
    )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['bookings'] = [
            booking 
            for booking in representation['bookings'] 
            if booking['status'] == 'confirmed'
        ]
        
        return representation





    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    
    class Meta:
        model = Rooms
        fields = [
            'id',
            'number',
            'floor',
            'price',
            'room_type',
            'room_type_name',
            'photo',
            'bookings'
        ]


class Room_typeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room_types
        fields = [
            'id',
            'name'
        ]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'price'
        ]


class BookingServiceInputSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0)


class BookingSerializer(serializers.ModelSerializer):
    services_data = BookingServiceInputSerializer(many=True, write_only=True)
    

    room_name = serializers.CharField(source='room.number', read_only=True)

    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Booking
        fields = ['id', 'user', 'room', 'room_name', 'status', 'status_display', 'check_in', 'check_out', 'services_data']
        read_only_fields = ['user']


    def create(self, validated_data):
        user = self.context['request'].user
        # Извлекаем данные сервисов из validated_data
        services_data = validated_data.pop('services_data', [])
        room_id = validated_data['room'].id

        try:
            room = Rooms.objects.get(id=room_id)
        except Rooms.DoesNotExist:
            raise serializers.ValidationError({'room': 'Комната с таким ID не существует'})
        
        try:
            booking = Booking(
            user=user,
            **validated_data
            )


            booking.clean()

            booking.save() 

            for service_item in services_data:
                service_id = service_item['service_id'] 
                quantity = service_item['quantity'] 
                
                try:
                    service = Service.objects.get(id=service_id)
                    
                    Booking_service.objects.create(
                        booking=booking, 
                        service=service,  
                        quantity=quantity, 
                    )
                                     
                except Service.DoesNotExist:
                    continue

        except ValidationError as e:
            raise serializers.ValidationError(e.message)
        
        return booking

    def to_representation(self, instance):
    
        representation = super().to_representation(instance)
        
 
        booking_services = Booking_service.objects.filter(booking=instance)
        services_info = []
        
        for bs in booking_services:
            services_info.append({
                'service_price': bs.service.price,
                'service_id': bs.service.id,
                'service_name': bs.service.name,
                'quantity': bs.quantity,
                'subtotal': bs.service.price * bs.quantity
            })
        
        representation['services'] = services_info  
        return representation
    

class BookingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking_service
        fields = '__all__'
