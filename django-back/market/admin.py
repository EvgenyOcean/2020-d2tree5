from django.contrib import admin
from .models import *


class ChangeHistoryInline(admin.StackedInline):
    model = ChangeHistory
    extra = 0
    readonly_fields = ['date_created']

    def has_change_permission(self, request, obj):
        return False


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['date_created']


class PositionAdmin(admin.ModelAdmin):
    inlines = [ChangeHistoryInline, PaymentInline]


# change to the tabularinline
class PositionInline(admin.StackedInline):
    model = Position
    extra = 3


class RequestAdmin(admin.ModelAdmin):
    inlines = [PositionInline]


admin.site.register(Request, RequestAdmin)
admin.site.register(Position, PositionAdmin)
admin.site.register(Payment)
admin.site.register(ChangeHistory)