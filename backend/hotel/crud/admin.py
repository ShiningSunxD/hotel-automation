from django.contrib import admin
from .models import *

admin.site.register(Rooms)
admin.site.register(Room_types)
admin.site.register(Booking)
admin.site.register(Service)
admin.site.register(Booking_service)