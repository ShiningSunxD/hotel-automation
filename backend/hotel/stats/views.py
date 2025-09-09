# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count
from django.contrib.auth.models import User
from crud.models import Booking
from rest_framework.permissions import IsAdminUser

class TodayStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        
        bookings_today = Booking.objects.filter(
            created_at__date=today
        ).count()
        
        registrations_today = User.objects.filter(
            date_joined__date=today
        ).count()
        
        return Response({
            'date': today,
            'bookings': bookings_today,
            'registrations': registrations_today
        })

class WeeklyStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=6)
        
        # Статистика по дням
        stats = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            
            day_bookings = Booking.objects.filter(
                created_at__date=current_date
            ).count()
            
            day_registrations = User.objects.filter(
                date_joined__date=current_date
            ).count()
            
            stats.append({
                'date': current_date,
                'bookings': day_bookings,
                'registrations': day_registrations
            })
        
        return Response({
            'period': f'{start_date} - {end_date}',
            'stats': stats
        })