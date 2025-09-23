from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, ArticleImageViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'article-images', ArticleImageViewSet, basename='articleimage')
urlpatterns = [
    path('', include(router.urls)),
]