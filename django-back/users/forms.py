from django import forms
from .models import CustomUser
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus check passwords."""
    password = forms.CharField(label='Password', widget=forms.PasswordInput, max_length=32, min_length=6)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'is_executor', 'is_customer')

    def clean(self):
        cleaned_data = super().clean()
        options = iter([cleaned_data.get('is_executor'), cleaned_data.get('is_customer')])

        if any(options) and not any(options):
            return cleaned_data
        
        err = ValidationError('User must be either an executor or a customer')
        self.add_error('is_executor', err)
        self.add_error('is_customer', err)
        raise err


    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password cache display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'about', 'is_active', 'is_staff', 'is_customer', 'is_executor')

    def clean(self):
        cleaned_data = super().clean()
        options = iter([cleaned_data.get('is_executor'), cleaned_data.get('is_customer')])

        if any(options) and not any(options):
            return cleaned_data

        err = ValidationError('User must be either an executor or a customer')
        self.add_error('is_executor', err)
        self.add_error('is_customer', err)
        raise err

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]