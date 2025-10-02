from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .models import UserProfile
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.utils import timezone

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]




class RegisterView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={'last_auth_date': timezone.now()}
            )
            if not created:
                profile.last_auth_date = timezone.now()
                profile.save()

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            
            if not user.is_superuser:
                profile = user.profile
                profile.last_auth_date = timezone.now()
                profile.save()
            
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def VerifyView(request):

    return Response(
        {
            'message': 'Token is valid',
            'user': {
                'id': request.user.id,
                'username': request.user.username,
            }
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def VerifyIsAdminView(request):

    return Response(
        {
            'message': 'Token is valid',
            'user': {
                'id': request.user.id,
                'username': request.user.username,
            }
        },
        status=status.HTTP_200_OK
    )

