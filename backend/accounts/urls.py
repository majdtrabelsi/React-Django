from django.urls import path
from .views import LoginView,UserRegistrationProView,UserRegistrationPerView,UserRegistrationCompView,LogoutView,UserStatusView,contact_form,ProfileViewSet,CSRFTokenView
from .views import ExperienceCreateView,EducationCreateView,SkillCreateView,InterestCreateView,AwardCreateView
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('registerpro/', UserRegistrationProView.as_view(), name='registerpro'),
    path('registerper/', UserRegistrationPerView.as_view(), name='registerper'),
    path('registercomp/', UserRegistrationCompView.as_view(), name='registercomp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('contact/', contact_form, name='contactform'),
    path('accountstatus/', UserStatusView.as_view(), name='accountstatus'),
    path('profiledata/', ProfileViewSet.as_view(), name='profiledata'),
    path('experience/', ExperienceCreateView.as_view(), name='experience'),
    path('education/', EducationCreateView.as_view(), name='education'),
    path('skills/', SkillCreateView.as_view(), name='skill'),
    path('interest/', InterestCreateView.as_view(), name='interest'),
    path('award/', AwardCreateView.as_view(), name='award'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    

]
