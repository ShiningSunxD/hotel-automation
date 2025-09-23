from django.utils import timezone
from django.db import models
from django.core.validators import FileExtensionValidator
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class Room_types(models.Model):
    name = models.CharField(max_length=50, verbose_name='Тип комнаты')

    def __str__(self):
        return f"{self.name}"

class Rooms(models.Model):
    number = models.PositiveIntegerField(verbose_name='Номер комнаты')
    floor = models.PositiveIntegerField(verbose_name='Этаж')
    price = models.PositiveIntegerField(verbose_name='Цена')
    room_type = models.ForeignKey(
        Room_types, 
        on_delete=models.CASCADE,
        related_name='rooms',
        verbose_name='Тип комнаты'
    )

    photo = ProcessedImageField(
        upload_to='rooms_photos/',
        processors=[ResizeToFill(800, 600)], 
        format='JPEG',
        options={'quality': 80},
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif']),
        ],
        verbose_name='Фотография комнаты'
    )

    def __str__(self):
        return f"Комната {self.number} ({self.room_type.name})"


class Service(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название сервиса')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    
    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
        ('completed', 'Завершено')
    ]

    room = models.ForeignKey(
        Rooms, 
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Комната'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='user_bookings',
        verbose_name='Пользователь'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Статус'
    )
    check_in = models.DateField(verbose_name='Дата въезда')
    check_out = models.DateField(verbose_name='Дата выезда')
    created_at = models.DateTimeField(default=timezone.now, blank=True, verbose_name='Создан')
    services = models.ManyToManyField(
        Service,
        through='Booking_service',
        verbose_name='Сервисы'
    )

    def clean(self):
        if self.check_in >= self.check_out:
            raise ValidationError("Дата выезда должна быть позже даты заезда")
        
        if self.check_in < timezone.now().date():
            raise ValidationError("Нельзя забронировать дату в прошлом")
        
        if Booking.objects.filter(
            room=self.room,
            check_in__lt=self.check_out,
            check_out__gt=self.check_in,
            status='confirmed'
        ).exists():
            raise ValidationError("Комната уже забронирована на эти даты")

    def __str__(self):
        return f"Бронирование {self.id} комнаты {self.room.number} с {self.check_in} по {self.check_out}"


class Booking_service(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, verbose_name='Бронирование')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='Сервис')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')



