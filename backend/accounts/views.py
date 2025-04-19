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
    ChangePasswordSerializer,
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
            user = serializer.save()
            authenticated_user = authenticate(request, email=user.email, password=password)
            if authenticated_user:
                login(request, authenticated_user)

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
            user = serializer.save()
            authenticated_user = authenticate(request, email=user.email, password=password)
            if authenticated_user:
                login(request, authenticated_user)

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
            user = serializer.save()
            authenticated_user = authenticate(request, email=user.email, password=password)
            if authenticated_user:
                login(request, authenticated_user)

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
            return Response({"isAuthenticated": True, "user": request.user.email, "userType": request.user.type, "is_paid": request.user.is_paid})
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


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accountdatas(request):
    user = request.user
    data = {
        "username": user.username,
        "first_name":user.last_name,
        "last_name":user.last_name,
        "last_login": user.last_login,
        "date_joined": user.date_joined,
        "account_type": user.type,
    }
    return Response(data)

from .models import BillingInfo
from .serializers import BillingInfoSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings
import stripe
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import BillingInfo, BillingHistory
from .serializers import BillingInfoSerializer, BillingHistorySerializer
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def billing_status(request):
    billing, created = BillingInfo.objects.get_or_create(user=request.user)
    serializer = BillingInfoSerializer(billing)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_billing(request):
    data = request.data
    card_number = data.get('cardNumber', '')
    expiry = data.get('expiry', '')
    cvv = data.get('cvv', '')

    if not all([card_number, expiry, cvv]):
        return Response({'error': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)

    billing, created = BillingInfo.objects.get_or_create(user=request.user)
    billing.save_encrypted_card(card_number, expiry, cvv)


    return Response({'status': 'Billing information updated'})

class DeleteCardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            billing_info = BillingInfo.objects.get(user=request.user)
            billing_info.encrypted_card_number = None
            billing_info.encrypted_expiry = None
            billing_info.encrypted_cvv = None
            billing_info.save()
            return Response({'message': 'Credit card deleted successfully.'}, status=status.HTTP_200_OK)
        except BillingInfo.DoesNotExist:
            return Response({'error': 'No billing info found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BillingHistoryView(ListAPIView):
    serializer_class = BillingHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BillingHistory.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment(request):
    try:
        user = request.user
        plan_type = request.data.get('plan', 'company')

        price_id_map = {
            'company': settings.STRIPE_COMPANY_PRICE_ID,
            'professional': settings.STRIPE_PROFESSIONAL_PRICE_ID,
        }

        price_id = price_id_map.get(plan_type)
        if not price_id:
            return Response({'detail': 'Invalid plan type'}, status=status.HTTP_400_BAD_REQUEST)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}",
            cancel_url=f"{settings.FRONTEND_URL}",
            customer_email=user.email,
            metadata={'user_id': str(user.id)},
        )

        return Response({'url': session.url})

    except Exception as e:
        print("Stripe error:", str(e))
        return Response({'detail': 'Something went wrong creating the session.'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def payment_success(request):
    session_id = request.GET.get('session_id')
    if not session_id:
        return Response({'detail': 'Missing session_id'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        subscription = stripe.Subscription.retrieve(session.subscription)
        
        user_id = session.metadata.get('user_id')
        if not user_id:
            return Response({'detail': 'User ID missing in session metadata'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        user.is_paid = True
        user.subscription_id = subscription.id
        user.save()

        # ✅ Get public invoice URL
        invoice_id = session.invoice or session.id
        invoice_url = None

        if invoice_id:
            invoice = stripe.Invoice.retrieve(invoice_id)
            invoice_url = invoice.get('hosted_invoice_url')

        BillingHistory.objects.create(
            user=user,
            amount=session.amount_total / 100,
            description="Subscription Payment",
            created_at=datetime.fromtimestamp(session.created),
            status='paid',
            stripe_invoice_id=invoice_id,
            stripe_invoice_url=invoice_url  # ✅ save public invoice link
        )

        return Response({'detail': 'Payment verified and user updated'})

    except Exception as e:
        print("Payment verification error:", str(e))
        return Response({'detail': 'Could not verify your payment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    user = request.user

    if not user.subscription_id:
        return Response({'detail': 'No active subscription found'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    try:
        subscription = stripe.Subscription.retrieve(user.subscription_id)
        stripe.Subscription.modify(
            user.subscription_id,
            cancel_at_period_end=True
        )

        user.is_paid = False
        user.save()

        return Response({'detail': 'Subscription will cancel at period end'})

    except stripe.error.StripeError as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    user = request.user

    if not user.subscription_id:
        return Response({
            "plan": "Free",
            "status": "inactive",
            "renewal_date": None,
            "auto_renewal": False
        })

    try:
        subscription = stripe.Subscription.retrieve(
            user.subscription_id,
            expand=["items.data.plan"]
        )

        items = subscription.get("items", {}).get("data", [])
        if not items:
            raise Exception("No subscription items found")

        sub_item = items[0]
        plan_data = sub_item.get("plan")
        period_end_ts = sub_item.get("current_period_end")

        plan_name = plan_data.get("nickname") or f"${plan_data['amount'] / 100:.2f} / {plan_data['interval']}"
        renewal_date = datetime.fromtimestamp(period_end_ts) if period_end_ts else None
        auto_renewal = not subscription.get("cancel_at_period_end", True)
        status = subscription.get("status", "unknown")

        return Response({
            "plan": plan_name,
            "status": status,
            "renewal_date": renewal_date,
            "auto_renewal": auto_renewal
        })

    except Exception as e:
        print("❌ Error in subscription_status:", str(e))
        return Response({"error": "Unable to fetch subscription status."}, status=500)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_auto_renew(request):
    user = request.user

    if not user.subscription_id:
        print(f"❌ No subscription ID for user {user.email}")
        return Response({'error': 'No active subscription.'}, status=400)

    try:
        subscription = stripe.Subscription.retrieve(user.subscription_id)
        current = subscription.get('cancel_at_period_end', False)

        updated = stripe.Subscription.modify(
            user.subscription_id,
            cancel_at_period_end=not current
        )

        print(f"🔁 Auto-renew toggled: {not current} for user {user.email}")
        return Response({
            'message': f"Auto-renew has been {'disabled' if not current else 'enabled'}.",
            'auto_renewal': not updated['cancel_at_period_end']
        })

    except Exception as e:
        print("❌ Error toggling auto-renew:", str(e))
        return Response({'error': 'Failed to update auto-renew setting.'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def force_downgrade(request):
    user = request.user
    user.is_paid = False
    user.account_type = 'free'
    user.subscription_id = None
    user.save()
    return Response({'message': 'Account downgraded to Free.'})


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


