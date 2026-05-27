from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Team(models.Model):
    """Model representing a Pokémon team created by a user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'name')
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"
    
    def get_pokemon_count(self):
        """Returns the current number of Pokémon in this team."""
        return self.pokemon_in_team.count()
    
    def is_full(self):
        """Returns True if team has 6 Pokémon."""
        return self.get_pokemon_count() >= 6


class PokemonInTeam(models.Model):
    """Model representing a Pokémon instance added to a team."""
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='pokemon_in_team')
    pokedex_id = models.IntegerField()
    name = models.CharField(max_length=100)
    types = models.JSONField(default=list)  # List of type strings, e.g., ['electric', 'flying']
    sprites = models.JSONField(default=dict)  # Dict with sprite URLs from PokéAPI
    stats = models.JSONField(default=dict)  # Dict with base stats: hp, attack, defense, sp_atk, sp_def, speed
    position = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)],
        help_text="Position in team (1-6)"
    )
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['position']
        unique_together = ('team', 'position')
    
    def __str__(self):
        return f"{self.name} (#{self.pokedex_id}) - {self.team.name}"


class PokemonCache(models.Model):
    """Model for caching Pokémon data from PokéAPI to reduce API calls."""
    pokedex_id = models.IntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    types = models.JSONField(default=list)
    sprites = models.JSONField(default=dict)
    stats = models.JSONField(default=dict)
    abilities = models.JSONField(default=list)
    height = models.IntegerField(null=True, blank=True)
    weight = models.IntegerField(null=True, blank=True)
    cached_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Pokémon Cache"
    
    def __str__(self):
        return f"{self.name} (#{self.pokedex_id})"