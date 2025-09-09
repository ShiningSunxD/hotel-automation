from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        user = User.objects.create_user(
            password=validated_data['password'],
            username=validated_data['username']
        )
        UserProfile.objects.create(user=user)
        return user



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['last_auth_date']


    