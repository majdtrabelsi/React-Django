


from django.urls import path, include
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,CSRFTokenView

from .views import UserCompanyView
from .views import UserPersonProView
from .views import PortfolioViewSet
from .views import ExperienceViewSet
from .views import EducationViewSet
from .views import SkillViewSet
from .views import RqofferViewSet
from .views import PostListCreateView, CategoryListCreateView, CategoryDetailView
from .views import ReplyListCreateView



from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'offers', OfferViewSet , basename='offer')
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'educations', EducationViewSet, basename='education')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'rqoffers', RqofferViewSet, basename='rqoffer')





from .views import work_profile_view,disable_2fa,send_reset_email,verify_reset_token,reset_password
from django.urls import path
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,ProfileViewSet,CSRFTokenView
from .views import social_media_links,ChangePasswordView,accountdatas,BillingHistoryView,payment,payment_success,list_work_profiles,verify_2fa_token,enable_2fa,setup_2fa
from . import views
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('registerpro/', UserRegistrationProView.as_view(), name='registerpro'),
    path('registerper/', UserRegistrationPerView.as_view(), name='registerper'),
    path('registercomp/', UserRegistrationCompView.as_view(), name='registercomp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('contact/', contact_form, name='contactform'),
    path('accountstatus/', UserStatusView.as_view(), name='accountstatus'),
    path('profiledata/', ProfileViewSet.as_view({'get': 'retrieve', 'post': 'create'}), name='profiledata'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('social/', social_media_links, name='social'),
    path('api/', include(router.urls)),

    path('api/company/', UserCompanyView.as_view(), name='user-list'),
    path('api/personpro/', UserPersonProView.as_view(), name='user-list'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:id>/', CategoryDetailView.as_view(), name='category-detail'),
    path('replies/', ReplyListCreateView.as_view(), name='reply-list-create'),


    
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('accountdatas/', accountdatas, name='accountdatas'),
    path('billing/status/', views.billing_status),
    path('billing/update/', views.update_billing),
    path('billing/delete/', views.DeleteCardView.as_view(), name='delete_card'),
    path('billing/history/', BillingHistoryView.as_view(), name='billing_history'),
    path('payment/', payment),
    path('payment-success/', views.payment_success, name='payment_success'),
    path('cancel-subscription/', views.cancel_subscription, name='cancel-subscription'),
    path('subscription/status/', views.subscription_status, name='subscription-status'),
    path('subscription/toggle-auto-renew/', views.toggle_auto_renew, name='toggle_auto_renew'),
    path('force-downgrade/', views.force_downgrade),
    path('chat/<int:offer_id>/', views.get_messages),
    path('chat/<int:offer_id>/send/', views.send_message),
    path('chat/<int:offer_id>/close/', views.close_chat),
    path('chat-status/<int:offer_id>/', views.chat_status),
    path('chat/<int:offer_id>/typing/',views.update_typing),
    path('register-player-id/', views.register_player_id, name='register_player_id'),
    path('work-profile/', work_profile_view),
    path('work-profiles/', list_work_profiles),
    path('verify-2fa/', verify_2fa_token),
    path('enable_2fa/', enable_2fa),
    path('setup_2fa/', setup_2fa),
    path('disable-2fa/', disable_2fa),
    path('password-reset/', send_reset_email),
    path('password-reset/verify/', verify_reset_token),
    path('password-reset/confirm/', reset_password),
    path('password-reset/validate/', views.validate_reset_token),
    path('allprofiles/', views.all_profiles, name='all-profiles'),

]