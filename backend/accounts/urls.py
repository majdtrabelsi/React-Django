


from django.urls import path, include
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,CSRFTokenView

from .views import UserCompanyView
from .views import UserPersonProView
from .views import PortfolioViewSet
from .views import ExperienceViewSet
from .views import EducationViewSet
from .views import SkillViewSet
from .views import RqofferViewSet



from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'offers', OfferViewSet , basename='offer')
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'educations', EducationViewSet, basename='education')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'rqoffers', RqofferViewSet, basename='rqoffer')




from .views import CommunityMessageList


from django.urls import path
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,ProfileViewSet,CSRFTokenView
from .views import social_media_links,ChangePasswordView,accountdatas,BillingHistoryView,payment,payment_success
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

    path('messages/', CommunityMessageList.as_view(), name='accounts-messages'),

    
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

]