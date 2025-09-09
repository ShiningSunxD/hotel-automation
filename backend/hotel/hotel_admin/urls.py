from django.urls import path, include
from .views import DynamicMetadataView

urlpatterns = [
    path('metadata/', DynamicMetadataView.as_view(), name='metadata'),
]