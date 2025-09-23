from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Article, ArticleImage
from .serializers import ArticleListSerializer, ArticleDetailSerializer, ArticleImageSerializer, ImageUploadSerializer


class ArticleViewSet(viewsets.ModelViewSet):

    queryset = Article.objects.all()
    serializer_class = ArticleListSerializer


    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def list(self, request, *args, **kwargs):
        articles = Article.objects.all()
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)


    def retrieve(self, request, *args, **kwargs):
        slug = kwargs.get('pk')
        article = get_object_or_404(self.queryset, slug=slug)
        serializer = ArticleDetailSerializer(article)
        
        return Response(serializer.data)


    @action(detail=True, methods=['get'], url_path='images')
    def get_article_images(self, request, slug=None):
        article = get_object_or_404(self.queryset(), slug=slug)
        images = article.images.all().order_by('uploaded_at')
        serializer = ArticleImageSerializer(images, many=True)
        return Response(serializer.data)


class ArticleImageViewSet(viewsets.ModelViewSet):

    queryset = ArticleImage.objects.all()
    serializer_class = ArticleImageSerializer
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    @action(detail=False, methods=['post'])
    def upload_image(self, request):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            article_id = request.data.get('article')
            if not Article.objects.filter(id=article_id).exists():
                return Response(
                    {'error': 'Статья не найдена'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            image = serializer.save()
            return Response(
                {
                    'success': True,
                    'image_id': image.id,
                    'image_url': image.photo.url,
                    'message': 'Фото успешно загружено'
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
