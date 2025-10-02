from rest_framework import serializers
from .models import Article, ArticleImage

class ArticleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        return obj.photo.url
    
    class Meta:
        model = ArticleImage
        fields = ('id', 'article', 'image_url', 'photo', 'uploaded_at')

class ArticleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'title', 'slug', 'created_at')

class ArticleDetailSerializer(serializers.ModelSerializer):
    images = ArticleImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Article
        fields = ('id', 'title', 'slug', 'content', 'images', 'created_at', 'updated_at')

class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleImage
        fields = ('article', 'photo')