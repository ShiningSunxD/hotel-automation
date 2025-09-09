from django.urls import path, include
from .views import RegisterView, LoginView, LogoutView, VerifyView, VerifyIsAdminView, UserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user', UserViewSet, basename='room')
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify/', VerifyView, name='verify'),
    path('verify_admin/', VerifyIsAdminView, name='verifyIsAdmin'),
    path('', include(router.urls)),
]