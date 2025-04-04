


from django.urls import path, include
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,CSRFTokenView

from .views import UserCompanyView
from .views import UserPersonProView
from .views import PortfolioViewSet
from .views import ExperienceViewSet
from .views import EducationViewSet
from .views import SkillViewSet



from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'offers', OfferViewSet , basename='offer')
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'educations', EducationViewSet, basename='education')
router.register(r'skills', SkillViewSet, basename='skill')



from .views import offer_list_create


from django.urls import path
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,ProfileViewSet,CSRFTokenView
from .views import social_media_links
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
    path('offers/', offer_list_create, name='offer_list_create'),
    path('api/company/', UserCompanyView.as_view(), name='user-list'),
    path('api/personpro/', UserPersonProView.as_view(), name='user-list'),

    
    

]