from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'favorite_type', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'favorite_type')
    readonly_fields = ('created_at', 'updated_at')