# models.py
from django.db import models
from django.utils.text import slugify
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from django.core.validators import FileExtensionValidator

def article_image_path(instance, filename):

    if instance.article and instance.article.slug:
        return f'articles/{instance.article.slug}/{filename}'
    return f'articles/unknown/{filename}'

class Article(models.Model):
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    slug = models.SlugField(unique=True, verbose_name="URL")
    content = models.TextField(verbose_name="Текст статьи")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ArticleImage(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='images')
    photo = ProcessedImageField(
        upload_to=article_image_path,
        processors=[ResizeToFill(800, 600)], 
        format='JPEG',
        options={'quality': 80},
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif']),
        ],
        verbose_name='Фотография'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"Изображение для {self.article.title}"
