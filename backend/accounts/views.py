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


from datetime import timedelta
from django.utils.timezone import now

class LoginView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            if user.is_2fa_enabled:
                # Don't log in yet — wait for OTP verification
                request.session['pre_2fa_user_id'] = user.id
                return Response({"message": "2FA required", "2fa_required": True}, status=206)

            # Otherwise, proceed with login
            login(request, user)
            user_type = user.type

            # Trial/subscription check
            trial_expired = False
            subscription_ended = False

            if user_type == 'company':
                joined = user.date_joined
                trial_end = joined + timedelta(days=15)

                if not user.is_paid and now() > trial_end:
                    trial_expired = True

                if user.subscription_id and not user.is_paid:
                    subscription_ended = True

            return Response({
                'message': 'Login successful!',
                'type': user_type,
                'is_paid': user.is_paid,
                'trial_expired': trial_expired,
                'subscription_ended': subscription_ended,
            }, status=status.HTTP_200_OK)

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
            return Response({"isAuthenticated": True, "user": request.user.email, "userType": request.user.type, "is_paid": request.user.is_paid, "user_id": request.user.id, "is_2fa_enabled": request.user.is_2fa_enabled})
        return Response({"isAuthenticated": False}, status=status.HTTP_401_UNAUTHORIZED)


from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
import json
from .models import ContactMessage

@csrf_exempt
@require_POST
def contact_form(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        # Save to DB
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # Email content
        admin_subject = f"New Contact Message from {name} - {subject}"
        admin_message = f"Name: {name}\nEmail: {email}\nMessage:\n{message}"

        customer_subject = "Thank you for contacting us!"
        customer_message = (
            f"Hi {name},\n\n"
            "Thank you for reaching out to us. We have received your message:\n\n"
            f"{message}\n\n"
            "Best regards,\nYour Company Name"
        )

        # Send to admin
        send_mail(
            admin_subject,
            admin_message,
            settings.DEFAULT_FROM_EMAIL,
            [getattr(settings, 'ADMIN_EMAIL', 'abdelbacet.labidi@isimg.tn')]
        )

        # Confirmation to customer
        send_mail(
            customer_subject,
            customer_message,
            settings.DEFAULT_FROM_EMAIL,
            [email]
        )

        return JsonResponse({'success': 'Message sent successfully!'})

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': 'Failed to send message.'}, status=500)


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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
        users = User.objects.filter(type='company')
        # You can return specific fields like username, email, etc.
        user_data = [{"id":user.id,  "firstname": user.first_name, "lastname": user.last_name,"company_name": user.companyname,"user_name":user.username} for user in users]
        return Response(user_data, status=status.HTTP_200_OK)


class UserPersonProView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, including unauthenticated users

    def get(self, request):
        # Fetch all users from the database
        users = User.objects.filter(type__in=['personal', 'professional'])
        # You can return specific fields like username, email, etc.
        user_data = [{"id":user.id,"firstname": user.first_name, "lastname": user.last_name} for user in users]
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
    filterset_fields = ['user_name']



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
#@permission_classes([IsAuthenticated])
def social_media_links(request):
    # Default: use the authenticated user
    user = request.user

    # Allow GET by ?user_name=... for company viewers
    if request.method == 'GET' and 'user_name' in request.GET:
        try:
            user = User.objects.get(email=request.GET['user_name'])
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        social_links = SocialMediaLink.objects.get(user=user)
    except SocialMediaLink.DoesNotExist:
        if request.method == 'GET':
            # Return empty structure if not found
            return Response({}, status=status.HTTP_200_OK)
        # Allow POST to create links for current user
        social_links = SocialMediaLink.objects.create(user=user)

    if request.method == 'POST':
        # Prevent editing other users' social data
        if user != request.user:
            return Response({"detail": "You cannot edit this user's data."}, status=status.HTTP_403_FORBIDDEN)

        serializer = SocialMediaLinkSerializer(social_links, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET request
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
        "first_name":user.first_name,
        "last_name":user.last_name,
        "last_login": user.last_login,
        "date_joined": user.date_joined,
        "account_type": user.type,
        "is_paid": user.is_paid,
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

class BillingHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            latest_invoice = BillingHistory.objects.filter(user=user).order_by('-created_at').first()
            if not latest_invoice or not latest_invoice.stripe_invoice_id:
                raise Exception("No invoice available to trace customer.")

            # Get session from invoice
            invoice = stripe.Invoice.retrieve(latest_invoice.stripe_invoice_id)
            customer_id = invoice.customer

            invoices = stripe.Invoice.list(customer=customer_id, limit=10)

            for invoice in invoices.auto_paging_iter():
                if not invoice.paid:
                    continue

                paid_ts = invoice.status_transitions.get("paid_at") or invoice.created

                BillingHistory.objects.get_or_create(
                    stripe_invoice_id=invoice.id,
                    defaults={
                        'user': user,
                        'amount': invoice.amount_paid / 100,
                        'description': "Auto-renewal payment",
                        'created_at': datetime.fromtimestamp(paid_ts),
                        'status': 'paid',
                        'stripe_invoice_url': invoice.hosted_invoice_url,
                    }
                )

        except Exception as e:
            print("")

        history = BillingHistory.objects.filter(user=user).order_by('-created_at')
        serializer = BillingHistorySerializer(history, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment(request):
    try:
        user = request.user
        plan_type = request.data.get('plan')
        print("🔥 Received plan from frontend:", plan_type)

        # Map personal users to the 'professional' plan
        if plan_type == 'personal':
            plan_type = 'professional'

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
            cancel_url=f"{settings.STRIPE_CANCEL_URL}",
            customer_email=user.email,
            metadata={
                'user_id': str(user.id),
                'upgrade_to': 'professional' if user.type == 'personal' else ''
            },
        )

        return Response({'url': session.url})

    except Exception as e:
        print("Stripe error:", str(e))
        return Response({'detail': 'Something went wrong creating the session.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

        # Upgrade if needed
        upgrade_to = session.metadata.get('upgrade_to')
        if upgrade_to:
            user.type = upgrade_to  # 🔥 change from personal to professional

        user.save()

        # ✅ Invoice public URL
        invoice_id = session.invoice or session.id
        invoice_url = None
        if BillingHistory.objects.filter(stripe_invoice_id=invoice_id).exists():
            return Response({'message': 'Payment already verified.'}, status=200)


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
            stripe_invoice_url=invoice_url
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
            "auto_renewal": auto_renewal,
            "cancel_at_period_end": subscription.get("cancel_at_period_end", False)
        })

    except Exception as e:
        print("❌ Error in subscription_status:", str(e))
        return Response({"error": "Unable to fetch subscription status."}, status=500)



from .models import BillingInfo
from .utils import decrypt_value
import stripe

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_auto_renew(request):
    user = request.user

    if not user.subscription_id:
        print(f"❌ No subscription ID for user {user.email}")
        return Response({'error': 'No active subscription.'}, status=400)

    billing = BillingInfo.objects.filter(user=user).first()
    if not billing or not billing.has_card():
        print(f"❌ No credit card on file for user {user.email}")
        return Response({'error': 'You must add a credit card before enabling auto-renew.'}, status=400)

    try:
        # Optional: Test the card now with a $1 off-session charge, <-
        # charge_saved_card(user, amount_cents=100)
        

        subscription = stripe.Subscription.retrieve(user.subscription_id)
        current = subscription.get('cancel_at_period_end', False)

        updated = stripe.Subscription.modify(
            user.subscription_id,
            cancel_at_period_end=not current
        )

        print(f"🔁 Auto-renew toggled: {not current} for user {user.email}")
        return Response({
            'message': f"Auto-renew has been {'enabled' if not current else 'disabled'}.",
            'auto_renewal': not updated['cancel_at_period_end']
        })

    except Exception as e:
        print("❌ Error toggling auto-renew:", str(e))
        return Response({'error': 'Failed to update auto-renew setting.'}, status=500)

def charge_saved_card(user, amount_cents):
    billing = getattr(user, 'billing_info', None)
    if not billing or not billing.has_card():
        raise Exception("No saved card found for this user.")
    try:
        card_number = decrypt_value(billing.encrypted_card_number)
        expiry = decrypt_value(billing.encrypted_expiry)
        exp_month, exp_year = expiry.split('/')
        cvc = decrypt_value(billing.encrypted_cvv)
    except Exception as e:
        raise Exception(f"Decryption failed: {str(e)}")

    try:
        payment_method = stripe.PaymentMethod.create(
            type="card",
            card={
                "number": card_number,
                "exp_month": exp_month,
                "exp_year": f"20{exp_year}" if len(exp_year) == 2 else exp_year,
                "cvc": cvc,
            },
        )
    except stripe.error.CardError as e:
        raise Exception("Stripe card error: " + str(e))

    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='usd',
            payment_method=payment_method.id,
            confirm=True,
            off_session=True,
        )
        return payment_intent
    except stripe.error.CardError as e:
        raise Exception("Card error: " + str(e))
    except stripe.error.StripeError as e:
        raise Exception("Stripe error: " + str(e))

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
from .models import ChatStatus

from .models import OneSignalPlayer
from .utils import send_onesignal_notification

class RqofferViewSet(viewsets.ModelViewSet):
    queryset = Rqoffer.objects.all()
    serializer_class = RqofferSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['id_offer']

    def perform_create(self, serializer):
        rqoffer = serializer.save()

        try:
            # Fetch the company user using name_company
            company_user = User.objects.get(email=rqoffer.name_company, type='company')
            player = OneSignalPlayer.objects.filter(user=company_user).first()

            if player:
                send_onesignal_notification(
                    player.player_id,
                    "📨 New Offer Request",
                    f"{rqoffer.name_person} sent you a request."
                )
            else:
                print("❌ No OneSignalPlayer found for company:", rqoffer.name_company)
        except User.DoesNotExist:
            print("❌ Company user not found with name:", rqoffer.name_company)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.rp_offer

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        new_status = serializer.validated_data.get("rp_offer")
        if new_status and new_status != old_status:
            player = OneSignalPlayer.objects.filter(user__username=instance.name_person).first()

            if player:
                if new_status == 'accept':
                    msg = "🎉 Your offer has been accepted!"
                elif new_status == 'refuse':
                    msg = "❌ Your offer has been declined."
                else:
                    msg = None

                if msg:
                    send_onesignal_notification(
                        player.player_id,
                        "Offer Status Update",
                        msg
                    )

        return Response(serializer.data)



from .models import ChatMessage
from .utils import is_user_allowed_in_chat

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, offer_id):
    try:
        chat = Rqoffer.objects.get(id=offer_id)
    except Rqoffer.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)

    if not is_user_allowed_in_chat(request.user, chat):
        return Response({'error': 'Unauthorized'}, status=403)

    messages = ChatMessage.objects.filter(offer_id=offer_id).order_by('timestamp')
    status = ChatStatus.objects.filter(offer_id=offer_id).first()

    unread = messages.filter(is_read=False).exclude(sender=request.user)
    unread.update(is_read=True)

    response_data = []
    for m in messages:
        if m.sender.type == 'company':
            sender_name = m.sender.companyname
        else:
            sender_name = f"{m.sender.first_name} {m.sender.last_name}"

        response_data.append({
            'id': m.id,
            'text': m.text,
            'sender': m.sender.id,
            'sender_name': sender_name,
            'timestamp': m.timestamp,
            'is_read': m.is_read,
        })

    return Response({
        'messages': response_data,
        'typing': status.typing_user != request.user if status else False
    })

from .models import Rqoffer
from .models import OneSignalPlayer
from .utils import send_onesignal_notification
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, offer_id):
    try:
        chat = Rqoffer.objects.get(id=offer_id)
    except Rqoffer.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)

    # ✅ Only check permissions *after* chat is guaranteed to exist
    if not is_user_allowed_in_chat(request.user, chat):
        return Response({'error': 'You are not authorized to view this chat.'}, status=403)

    if chat.chat_closed:
        return Response({'error': 'Chat is closed'}, status=403)

    text = request.data.get('text')
    if not text:
        return Response({'error': 'Empty message'}, status=400)

    message = ChatMessage.objects.create(
        offer=chat,
        sender=request.user,
        text=text,
    )
    # After message is created
    # Find recipient
    recipient = chat.user if message.sender != chat.user else chat.company
    player = OneSignalPlayer.objects.filter(user=recipient).first()

    if player:
        send_onesignal_notification(
            player.player_id,
            "💬 New Message",
            f"New message from {request.user.first_name or 'User'}"
        )


    return Response({'status': 'sent', 'message_id': message.id})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_status(request, offer_id):
    
    try:
        chat = Rqoffer.objects.get(id=offer_id)
        return Response({'chat_closed': chat.chat_closed})
    except Rqoffer.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)
    if not is_user_allowed_in_chat(request.user, chat):
        return Response({'error': 'Unauthorized'}, status=403)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_chat(request, offer_id):
    try:
        chat = Rqoffer.objects.get(id=offer_id)
        if request.user.type == 'personal':
            return Response({'error': 'Only companies can close the chat.'}, status=403)

        chat.chat_closed = True
        chat.save()
        return Response({'message': 'Chat closed successfully'})
    except Rqoffer.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)

    if not is_user_allowed_in_chat(request.user, chat):
        return Response({'error': 'Unauthorized'}, status=403)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_typing(request, offer_id):
    try:
        chat = Rqoffer.objects.get(id=offer_id)
    except Rqoffer.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=404)

    if not is_user_allowed_in_chat(request.user, chat):
        return Response({'error': 'Not authorized'}, status=403)

    status, _ = ChatStatus.objects.get_or_create(offer=chat)
    status.typing_user = request.user
    status.save()
    return Response({'status': 'updated'})


# community/views.py
from rest_framework import generics
from .models import Post, Category
from .serializers import PostSerializer, CategorySerializer

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'



# community/views.py

from .models import Reply
from .serializers import ReplySerializer

class ReplyListCreateView(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer




from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import OneSignalPlayer

@csrf_exempt
@login_required
def register_player_id(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player_id = data.get('player_id')

        if not player_id:
            return JsonResponse({'error': 'Missing player_id'}, status=400)

        # Save or update
        OneSignalPlayer.objects.filter(user=request.user).exclude(player_id=player_id).delete()
        obj, created = OneSignalPlayer.objects.update_or_create(
            user=request.user,
            defaults={'player_id': player_id}
        )

        return JsonResponse({'message': 'Player ID saved.'}, status=200)

    return JsonResponse({'error': 'Invalid request'}, status=405)



from .models import WorkProfile
from .serializers import WorkProfileSerializer

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def work_profile_view(request):
    user = request.user

    try:
        profile = WorkProfile.objects.get(user=user)
    except WorkProfile.DoesNotExist:
        profile = None

    if request.method in ['POST', 'PUT']:
        serializer = WorkProfileSerializer(instance=profile, data=request.data)
        if serializer.is_valid():
            instance = serializer.save(user=user)
            return Response(WorkProfileSerializer(instance).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        if profile:
            serializer = WorkProfileSerializer(profile)
            return Response(serializer.data)
        return Response({}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_work_profiles(request):
    profiles = WorkProfile.objects.select_related('user').all()
    data = []
    for profile in profiles:
        data.append({
            'id' : profile.user.id,
            'firstname': profile.user.first_name,
            'lastname': profile.user.last_name,
            'email': profile.user.email,
            'domain': profile.domain,
            'specialty': profile.specialty,
            'description': profile.description,
        })
    return Response(data)


import pyotp
import qrcode
import io
import base64
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def setup_2fa(request):
    user = request.user

    if not user.two_factor_secret:
        user.two_factor_secret = pyotp.random_base32()
        user.save()

    # Generate QR code
    uri = user.get_totp_uri()
    img = qrcode.make(uri)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

    return Response({
        'qr_code': qr_code_base64,
        'secret': user.two_factor_secret,
        'uri': uri
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enable_2fa(request):
    token = request.data.get("token")
    user = request.user

    if user.verify_otp(token):
        user.is_2fa_enabled = True
        user.save()
        return Response({"message": "2FA enabled successfully."})
    return Response({"error": "Invalid token"}, status=400)

@api_view(['POST'])
def verify_2fa_token(request):
    token = request.data.get("token")
    user_id = request.session.get('pre_2fa_user_id')

    if not user_id:
        return Response({"error": "No 2FA session found"}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if user.verify_otp(token):
        login(request, user)
        del request.session['pre_2fa_user_id']

        user_type = user.type
        trial_expired = False
        subscription_ended = False

        if user_type == 'company':
            joined = user.date_joined
            trial_end = joined + timedelta(days=15)

            if not user.is_paid and now() > trial_end:
                trial_expired = True

            if user.subscription_id and not user.is_paid:
                subscription_ended = True

        return Response({
            'message': '2FA verification successful!',
            'type': user_type,
            'is_paid': user.is_paid,
            'trial_expired': trial_expired,
            'subscription_ended': subscription_ended,
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid 2FA token"}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    user = request.user

    if not user.is_2fa_enabled:
        return Response({'message': '2FA is already disabled.'}, status=status.HTTP_200_OK)

    user.is_2fa_enabled = False
    user.two_factor_secret = None
    user.save()

    return Response({'message': '2FA has been disabled successfully.'}, status=status.HTTP_200_OK)


from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

User = get_user_model()

@api_view(['POST'])
def send_reset_email(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_U}/reset-password/{uid}/{token}"  # React
        # or Flutter deep link: myapp://reset-password/{uid}/{token}

        send_mail(
            subject='Reset your password',
            message=f'Click the link to reset your password: {reset_link}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({'message': 'Password reset email sent.'})
    except User.DoesNotExist:
        return Response({'error': 'No user found with this email.'}, status=404)


from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

@api_view(['POST'])
def verify_reset_token(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            return Response({'valid': True})
        else:
            return Response({'valid': False}, status=400)

    except Exception:
        return Response({'valid': False}, status=400)


@api_view(['POST'])
def reset_password(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('new_password')

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=400)

        user.set_password(password)
        user.save()
        return Response({'message': 'Password updated successfully.'})
    except Exception:
        return Response({'error': 'Invalid request.'}, status=400)



from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

@api_view(['POST'])
def validate_reset_token(request):
    uid = request.data.get('uid')
    token = request.data.get('token')

    if not uid or not token:
        return Response({'error': 'Missing uid or token'}, status=400)
    try:
        uid = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError, UnicodeDecodeError):
        return Response({'error': 'Invalid user'}, status=400)
    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Invalid or expired token'}, status=400)

    return Response({'valid': True})



@api_view(['GET'])
def all_profiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)


from .models import OfferApplication
from .serializers import OfferApplicationSerializer
from django.utils.timezone import now, timedelta

from .models import OfferApplication
from .serializers import OfferApplicationSerializer

class ApplyOfferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        offer_id = request.data.get('offer_id')

        if not offer_id:
            return Response({"error": "Offer ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Personal users get 3/day limit
        if user.type == 'personal':
            today = now().date()
            apps_today = OfferApplication.objects.filter(user=user, applied_at__date=today).count()
            if apps_today >= 3:
                return Response(
                    {"error": "You’ve reached your 3 daily offer applications."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        # Save new application
        application = OfferApplication.objects.create(user=user, offer_id=offer_id)
        serializer = OfferApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.type != "personal":
            return Response({"count": None})  # or skip entirely

        today = now().date()
        count = OfferApplication.objects.filter(user=user, applied_at__date=today).count()
        return Response({"count": count})