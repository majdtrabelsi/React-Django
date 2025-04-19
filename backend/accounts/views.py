from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework import status,permissions,viewsets,serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect
from .serializers import (
    UserRegistrationProSerializer,
    UserRegistrationPerSerializer,
    UserRegistrationCompSerializer,
    ProfileSerializer,
    ExperienceSerializer,
    EducationSerializer,
    SkillSerializer,
    InterestSerializer,
    AwardSerializer,
    SocialMediaLinkSerializer,
)
from .models import Profile, Experience, Education, Skill, Interest, Award, SocialMediaLink
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
import logging
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes


logger = logging.getLogger(__name__)

User = get_user_model()


class CSRFTokenView(APIView):
    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})


class LoginView(APIView):
    def post(self, request):
        # If the user is already authenticated, return a message and prevent them from logging in again
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            user_type = user.type
            return Response({
                'message': 'Login successful!',
                'type': user_type
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class BaseUserRegistrationView(APIView):
    """ Base view for user registration """

    serializer_class = None

    def post(self, request):
        # If the user is already authenticated, prevent access to registration page
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in. Cannot register again.'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure unique email
        email = request.data.get("email")
        if User.objects.filter(email=email).exists():
            return Response({"message": "Account already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create serializer instance
        serializer = self.serializer_class(data=request.data)
        
        # Validate and save user data
        if serializer.is_valid():
            # Ensure password confirmation check
            password = request.data.get("password")
            confirm_password = request.data.get("confirm_password")
            if password != confirm_password:
                return Response({"message": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the validated data
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        # If serializer fails, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationProView(APIView):
    serializer_class = UserRegistrationProSerializer

    def post(self, request):
        # If the user is already authenticated, prevent access to registration page
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in. Cannot register again.'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get("email")
        
        # Ensure unique email
        if User.objects.filter(email=email).exists():
            return Response({"message": "Account already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create serializer instance
        serializer = self.serializer_class(data=request.data)
        
        # Validate and save user data
        if serializer.is_valid():
            # Ensure password confirmation check
            password = request.data.get("password")
            confirm_password = request.data.get("confirm_password")
            if password != confirm_password:
                return Response({"message": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the validated data
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        # If serializer fails, return validation errors
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationPerView(BaseUserRegistrationView):
    serializer_class = UserRegistrationPerSerializer

class UserRegistrationCompView(APIView):
    def post(self, request, *args, **kwargs):
        # If the user is already authenticated, prevent access to registration page
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in. Cannot register again.'}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Incoming data: {request.data}")

        email = request.data.get("email")
        if User.objects.filter(email=email).exists():
            return Response({"message": "Account already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create serializer instance
        serializer = UserRegistrationCompSerializer(data=request.data)

        # Validate and save user data
        if serializer.is_valid():
            # Ensure password confirmation check
            password = request.data.get("password")
            confirm_password = request.data.get("confirm_password")
            if password != confirm_password:
                return Response({"message": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the validated data
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            response = JsonResponse({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)
        else:
            response = JsonResponse({"message": "Not logged in."}, status=status.HTTP_400_BAD_REQUEST)

        # CORS Headers
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

class UserStatusView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({"isAuthenticated": True, "user": request.user.email, "userType": request.user.type})
        return Response({"isAuthenticated": False}, status=status.HTTP_401_UNAUTHORIZED)


from django.core.mail import send_mail

from django.views.decorators.csrf import csrf_exempt
import json
from .models import ContactMessage
import json

@csrf_exempt
def contact_form(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject')
            message = data.get('message')

            # Check if all fields are present
            if not all([name, email, subject, message]):
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Save the contact message in the database
            contact_message = ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )

            # Admin email content
            # admin_subject = f"New Contact Message from {name} - {subject}"
            # admin_message = f"Name: {name}\nEmail: {email}\nMessage:\n{message}"

            # Customer email content (confirmation)
            #customer_subject = "Thank you for contacting us!"
            #customer_message = f"Hi {name},\n\nThank you for reaching out to us. We have received your message:\n\n{message}\n\nBest regards,\nYour Company Name"

            # Sending email to the admin
            # send_mail(admin_subject, admin_message, 'your-email@example.com', ['admin-email@example.com'])

            # Sending confirmation email to the customer
            # send_mail(customer_subject, customer_message, 'your-email@example.com', [email])

            # Return success response
            return JsonResponse({'success': 'Message sent successfully!'})

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse({'error': 'Failed to send message. Please try again later.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


    def create(self, request, *args, **kwargs):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response



class InterestCreateView(APIView):
    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AwardCreateView(APIView):
    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    





from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.permissions import AllowAny  # Allow access for everyone

class UserCompanyView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, including unauthenticated users

    def get(self, request):
        logged_in_user = request.user

        # Fetch all users from the database
        users = User.objects.filter(type='company').exclude(id=logged_in_user.id)
        # You can return specific fields like username, email, etc.
        user_data = [{"id":user.id,  "firstname": user.firstname, "lastname": user.lastname} for user in users]
        return Response(user_data, status=status.HTTP_200_OK)


class UserPersonProView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, including unauthenticated users

    def get(self, request):
        # Fetch all users from the database
        users = User.objects.filter(type__in=['personal', 'professional'])
        # You can return specific fields like username, email, etc.
        user_data = [{"id":user.id,"firstname": user.firstname, "lastname": user.lastname} for user in users]
        return Response(user_data, status=status.HTTP_200_OK)
    




# offers/views.py# views.py
from rest_framework import viewsets
from .models import Offer
from .serializers import OfferSerializer
from django_filters.rest_framework import DjangoFilterBackend

class OfferViewSet(viewsets.ModelViewSet):
    serializer_class = OfferSerializer
    queryset = Offer.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['user_name']  # Allow filtering by 'user_name'












# accounts/views.py
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    queryset = Portfolio.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['user_name']  # Allow filtering by 'user_name'




    

from .models import Experience
from .serializers import ExperienceSerializer

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['user_name']  # Allow filtering by 'user_name'
 


from .models import Education
from .serializers import EducationSerializer

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    queryset = Education.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['user_name']  # Allow filtering by 'user_name'




from rest_framework import viewsets
from .models import Skill
from .serializers import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['user_name']  # Allow filtering by 'user_name'

    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def social_media_links(request):
    user = request.user
    try:
        social_links = SocialMediaLink.objects.get(user=user)
    except SocialMediaLink.DoesNotExist:
        social_links = SocialMediaLink.objects.create(user=user)

    if request.method == 'POST':
        print("🔹 Received POST request:", request.data)  # Debugging

        serializer = SocialMediaLinkSerializer(social_links, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("Link updated successfully:", serializer.data)  # Debugging
            return Response(serializer.data, status=status.HTTP_200_OK)

        print("Serializer Errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer = SocialMediaLinkSerializer(social_links)
    return Response(serializer.data)




from rest_framework import viewsets
from .models import Rqoffer
from .serializers import RqofferSerializer

class RqofferViewSet(viewsets.ModelViewSet):
    queryset = Rqoffer.objects.all()
    serializer_class = RqofferSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['id_offer']  # Allow filtering by 'user_name'






# community/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CommunityMessage
from .serializers import CommunityMessageSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class CommunityMessageList(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        messages = CommunityMessage.objects.all().order_by('timestamp')
        serializer = CommunityMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommunityMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


