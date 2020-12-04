from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Customer, CustomUser, Executor
from .forms import UserChangeForm, UserCreationForm

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'username', 'is_staff')
    list_filter = ('is_executor', 'is_customer')
    fieldsets = (
        (None, {'fields': ('email', 'username')}),
        ('Secret', {'fields': ('password',)}),
        ('Personal info', {'fields': ('about',)}),
        ('Permissions', {'fields': ('is_staff', 'is_customer', 'is_executor')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'is_executor', 'is_customer'),
        }),
    )



# Register your models here.
admin.site.register(Customer)
admin.site.register(Executor)