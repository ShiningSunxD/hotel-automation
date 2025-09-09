from django.urls import path, include
from .views import TodayStatsView, WeeklyStatsView

urlpatterns = [
    path('day_stats/', TodayStatsView.as_view(), name='day_stats'),
    path('week_stats/', WeeklyStatsView.as_view(), name='week_stats'),
]