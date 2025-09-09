from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import fields
from django.apps import apps
from rest_framework.permissions import IsAdminUser
from django.db import models

class DynamicMetadataView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        try:
            model_name = request.query_params.get('model')
            if not model_name:
                return Response({'error': 'Model parameter is required'}, status=400)
            
            # Получаем модель из приложения crud
            try:
                if(model_name == 'User'):
                    model = apps.get_model(app_label='auth', model_name=model_name)
                else:
                    model = apps.get_model(app_label='crud', model_name=model_name)
            except LookupError:
                return Response({'error': f'Model "{model_name}" not found'}, status=404)
            
            fields_data = []
            
            for field in model._meta.get_fields():
                # Пропускаем ManyToMany поля
                if field.many_to_many:
                    continue
                
                # Пропускаем обратные связи
                if field.auto_created:
                    continue
                
                field_data = {
                    'name': field.name,
                    'label': field.verbose_name,
                    'type': self._get_field_type(field),
                    'required': (not field.blank),
                    'options': []
                }
                
                if hasattr(field, 'remote_field') and field.remote_field:
                    field_data['type'] = 'select'
                    related_model = field.remote_field.model
                    try:
                        related_objects = related_model.objects.all()
                        field_data['options'] = [{'value': obj.pk, 'label': str(obj)} for obj in related_objects]
                    except Exception as e:
                        field_data['options'] = []
                        field_data['error'] = f'Cannot load options: {str(e)}'
                
                # Обработка FileField и ImageField
                elif isinstance(field, (models.FileField, models.ImageField)):
                    field_data['type'] = 'file'
                
                fields_data.append(field_data)
            
            return Response(fields_data)
    
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    
    def _get_field_type(self, field):
        field_type = field.get_internal_type().lower()
        
        type_mapping = {
            'charfield': 'text',
            'textfield': 'textarea',
            'integerfield': 'number',
            'floatfield': 'number',
            'decimalfield': 'number',
            'booleanfield': 'checkbox',
            'datefield': 'date',
            'datetimefield': 'datetime',
            'emailfield': 'email',
            'urlfield': 'url',
            'filefield': 'file',
            'imagefield': 'file',
        }
        
        return type_mapping.get(field_type, field_type)