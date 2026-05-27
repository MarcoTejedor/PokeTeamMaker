from django.contrib import admin
from .models import Team, PokemonInTeam, PokemonCache

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(PokemonInTeam)
class PokemonInTeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'position')
    list_filter = ('team', 'position')
    search_fields = ('name', 'team__name')

@admin.register(PokemonCache)
class PokemonCacheAdmin(admin.ModelAdmin):
    list_display = ('name', 'pokedex_id', 'cached_at')
    list_filter = ('cached_at',)
    search_fields = ('name', 'pokedex_id')
    readonly_fields = ('cached_at',)