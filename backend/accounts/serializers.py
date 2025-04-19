from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .models import ContactMessage,Profile,Experience, Education, Skill, Interest, Award, SocialMediaLink,User
from rest_framework.validators import UniqueValidator
User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class BaseUserRegistrationSerializer(serializers.ModelSerializer):
    """
    Base serializer to handle user registration logic.
    """

    password = serializers.CharField(write_only=True)  # Ensure password is not exposed
    confirm_password = serializers.CharField(write_only=True)  # Add password confirmation

    class Meta:
        model = User
        fields = ['email', 'username', 'firstname', 'lastname', 'password', 'confirm_password', 'type']
        extra_kwargs = {'username': {'required': False}}  # Mark username as optional

    def validate(self, data):
        """
        Ensure passwords match.
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        """
        Override the create method to hash the password and set the user type.
        """
        validated_data.pop('confirm_password')  # Remove confirm_password from data
        user = User(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),  # Default username to email if not provided
            first_name=validated_data['firstname'],
            last_name=validated_data['lastname'],
            type=validated_data['type'],  # User type is set here
            is_paid=False,
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user


class UserRegistrationProSerializer(BaseUserRegistrationSerializer):
    """
    Serializer for 'Professional' user registration.
    """
    type = serializers.CharField(default='professional')  # Default type to 'professional'


class UserRegistrationPerSerializer(BaseUserRegistrationSerializer):
    """
    Serializer for 'Personel' user registration.
    """
    type = serializers.CharField(default='personal')  # Default type to 'personal'


class UserRegistrationCompSerializer(BaseUserRegistrationSerializer):
    """
    Serializer for 'Company' user registration.
    """
    companyname = serializers.CharField(
    required=True,
    min_length=4,
    max_length=100,
    validators=[
        UniqueValidator(
            queryset=User.objects.all(),
            message="This company name is already taken."
            )
        ]
    )
    #hedha bech yab9a bin 4 w 100 chars w unique w champ obligatoire
    type = serializers.CharField(default='company')  # Default type to 'company'

    class Meta:
        model = User
        fields = ['email', 'username', 'firstname', 'lastname', 'password', 'confirm_password', 'companyname', 'type']
        extra_kwargs = {'username': {'required': False}}

    def create(self, validated_data):
        validated_data['username'] = validated_data.get('username', validated_data['email'])  # Use email as username if not provided

        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['firstname'],
            last_name=validated_data['lastname'],
            type=validated_data['type'],
            companyname=validated_data['companyname'],
            is_paid=False,
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = '__all__'

class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = '__all__'





class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['firstname' ,'lastname']  # Add any fields you need





# offers/serializers.py
# serializers.py
from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['id','user_name','title', 'description']


from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id','user_name','title', 'description']


from .models import Experience

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id','user_name','title', 'description', 'start_date_ex', 'end_date_ex' ]




class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'user_name', 'school_name', 'degree', 'description_ed', 'start_date_ed', 'end_date_ed']



class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'user_name', 'skill_name', 'proficiency' ]


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ['user','facebook', 'twitter', 'instagram', 'linkedin','github','twitch']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user

        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})

        return data

from .models import BillingInfo, BillingHistory

class BillingInfoSerializer(serializers.ModelSerializer):
    card_last4 = serializers.SerializerMethodField()
    expiry = serializers.SerializerMethodField()
    has_credit_card = serializers.SerializerMethodField()

    class Meta:
        model = BillingInfo
        fields = ['card_last4', 'expiry', 'added_at', 'has_credit_card']

    def get_card_last4(self, obj):
        return obj.card_last4()

    def get_expiry(self, obj):
        return obj.expiry()

    def get_has_credit_card(self, obj):
        return obj.has_card()


class BillingHistorySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = BillingHistory
        fields = ['amount', 'description', 'status', 'created_at', 'stripe_invoice_id', 'stripe_invoice_url']



from .models import Rqoffer

class RqofferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rqoffer
        fields = ['id', 'name_person', 'name_company', 'id_offer','rp_offer']



# community/serializers.py

from rest_framework import serializers
from .models import CommunityMessage

class CommunityMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityMessage
        fields = '__all__'
