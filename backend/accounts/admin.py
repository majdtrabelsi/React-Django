from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('id','username', 'email', 'first_name', 'last_name','type')  # Fields to display in the list view
    search_fields = ('username', 'email')  # Fields to search in the admin interface
    list_filter = ('id',)  # Filters to add in the admin interface

admin.site.register(User, UserAdmin)




# offers/admin.py

# admin.py
from django.contrib import admin
from .models import Offer

class OfferAdmin(admin.ModelAdmin):
    list_display = ('id','user_name','title', 'description')  # Display the title and description in the list view
    search_fields = ('title', 'description')  # Enable search by title and description

# Register the custom admin configuration
admin.site.register(Offer, OfferAdmin)


# Register your models here.
from django.contrib import admin
from .models import Portfolio

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('id','user_name','title', 'description')  # Display the title and description in the list view
    search_fields = ('title', 'description')  # Enable search by title and description

# Register the custom admin configuration
admin.site.register(Portfolio, PortfolioAdmin)


from .models import Experience

class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('id','user_name','title', 'description','start_date_ex', 'end_date_ex')  # Display the title and description in the list view
    search_fields = ('title', 'description')  # Enable search by title and description

# Register the custom admin configuration
admin.site.register(Experience, ExperienceAdmin)



from .models import Education

class EducationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'school_name', 'degree', 'description_ed', 'start_date_ed', 'end_date_ed')  # Display the title, description, and date fields in the list view
    search_fields = ['school_name', 'degree', 'description_ed']  # Enable search by school name, degree, and description

# Register the custom admin configuration
admin.site.register(Education, EducationAdmin)




from .models import Skill

class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'skill_name','proficiency')  # Display the title, description, and date fields in the list view
    search_fields = ['skill_name', 'proficiency']  # Enable search by school name, degree, and description

# Register the custom admin configuration
admin.site.register(Skill, SkillAdmin)