from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, PokemonInTeam, PokemonCache
from accounts.models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'favorite_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PokemonInTeamSerializer(serializers.ModelSerializer):
    """Serializer for PokemonInTeam model."""
    class Meta:
        model = PokemonInTeam
        fields = ['id', 'team', 'pokedex_id', 'name', 'types', 'sprites', 'stats', 'position', 'added_at']
        read_only_fields = ['id', 'added_at']


class PokemonInTeamCreateSerializer(serializers.ModelSerializer):
    """Serializer used when assigning a Pokémon to a team slot."""
    class Meta:
        model = PokemonInTeam
        fields = ['pokedex_id', 'name', 'types', 'sprites', 'stats', 'position']

    def validate_position(self, value):
        if value < 1 or value > 6:
            raise serializers.ValidationError('Position must be between 1 and 6.')
        return value


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model with nested Pokémon."""
    pokemon_in_team = PokemonInTeamSerializer(many=True, read_only=True)
    pokemon_count = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'user', 'name', 'description', 'pokemon_in_team', 'pokemon_count', 'is_full', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_pokemon_count(self, obj):
        return obj.get_pokemon_count()
    
    def get_is_full(self, obj):
        return obj.is_full()


class TeamListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for Team listing (without nested Pokémon)."""
    pokemon_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'pokemon_count', 'created_at', 'updated_at']
    
    def get_pokemon_count(self, obj):
        return obj.get_pokemon_count()


class PokemonCacheSerializer(serializers.ModelSerializer):
    """Serializer for PokemonCache model."""
    class Meta:
        model = PokemonCache
        fields = ['pokedex_id', 'name', 'types', 'sprites', 'stats', 'abilities', 'height', 'weight', 'cached_at']
        read_only_fields = ['cached_at']