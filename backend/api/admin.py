from django.contrib import admin
from .models import Category, Transaction, UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__username', 'phone_number')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'category', 'type', 'payment_method', 'date')
    list_filter = ('type', 'payment_method', 'category', 'date', 'user')
    search_fields = ('user__username', 'category__name')
    ordering = ('-date',)
