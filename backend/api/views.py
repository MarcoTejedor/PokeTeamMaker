from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
import requests
from django.conf import settings
from .models import Team, PokemonInTeam, PokemonCache
from .serializers import (
    TeamSerializer,
    TeamListSerializer,
    PokemonInTeamSerializer,
    PokemonInTeamCreateSerializer,
    PokemonCacheSerializer,
)


class PokemonSearchView(APIView):
    """
    API view for searching Pokémon from PokéAPI.
    Supports search by name or Pokedex ID.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        query = request.query_params.get('q', '').strip().lower()
        
        if not query:
            return Response(
                {'error': 'Query parameter "q" is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to fetch from PokéAPI
        try:
            pokeapi_url = f"{settings.POKEAPI_BASE_URL}/pokemon/{query}"
            response = requests.get(pokeapi_url, timeout=5)
            
            if response.status_code == 200:
                pokemon_data = response.json()
                
                # Extract relevant data
                pokemon = {
                    'pokedex_id': pokemon_data['id'],
                    'name': pokemon_data['name'].capitalize(),
                    'types': [t['type']['name'] for t in pokemon_data['types']],
                    'sprites': {
                        'front_default': pokemon_data['sprites']['front_default'],
                        'front_female': pokemon_data['sprites'].get('front_female'),
                        'back_default': pokemon_data['sprites']['back_default'],
                    },
                    'stats': {
                        stat['stat']['name']: stat['base_stat']
                        for stat in pokemon_data['stats']
                    },
                    'height': pokemon_data.get('height'),
                    'weight': pokemon_data.get('weight'),
                }
                
                # Cache the Pokémon data
                PokemonCache.objects.update_or_create(
                    pokedex_id=pokemon['pokedex_id'],
                    defaults={
                        'name': pokemon['name'],
                        'types': pokemon['types'],
                        'sprites': pokemon['sprites'],
                        'stats': pokemon['stats'],
                        'height': pokemon['height'],
                        'weight': pokemon['weight'],
                    }
                )
                
                return Response(pokemon, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': f'Pokémon "{query}" not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'Failed to fetch from PokéAPI: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class TeamListCreateView(ListCreateAPIView):
    """
    API view for listing and creating teams.
    Only authenticated users can create teams.
    """
    serializer_class = TeamListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TeamDetailView(RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting a specific team.
    """
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        # Use full serializer for detail view
        return TeamSerializer


class TeamSlotAssignView(APIView):
    """
    API view for assigning or updating a Pokémon in a specific team slot.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, position):
        try:
            team = Team.objects.get(pk=pk, user=request.user)
        except Team.DoesNotExist:
            return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = {**request.data, 'position': position}
        serializer = PokemonInTeamCreateSerializer(data=data)
        if serializer.is_valid():
            pokemon_data = serializer.validated_data

            pokemon_obj, created = PokemonInTeam.objects.update_or_create(
                team=team,
                position=position,
                defaults={
                    'pokedex_id': pokemon_data['pokedex_id'],
                    'name': pokemon_data['name'],
                    'types': pokemon_data['types'],
                    'sprites': pokemon_data['sprites'],
                    'stats': pokemon_data['stats'],
                }
            )

            response_serializer = PokemonInTeamSerializer(pokemon_obj)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, position):
        try:
            team = Team.objects.get(pk=pk, user=request.user)
        except Team.DoesNotExist:
            return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            pokemon_obj = PokemonInTeam.objects.get(team=team, position=position)
        except PokemonInTeam.DoesNotExist:
            return Response({'error': 'Slot is already empty.'}, status=status.HTTP_404_NOT_FOUND)

        pokemon_obj.delete()
        return Response({'message': 'Slot cleared successfully.'}, status=status.HTTP_200_OK)


class TeamAnalyzeView(APIView):
    """
    API view for analyzing a team's weaknesses and resistances.
    Returns aggregated type effectiveness data.
    """
    permission_classes = [IsAuthenticated]
    
    TYPE_EFFECTIVENESS = {
        'normal': {'weak_to': ['fighting'], 'resists': [], 'immune_to': ['ghost']},
        'fire': {'weak_to': ['water', 'ground', 'rock'], 'resists': ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], 'immune_to': []},
        'water': {'weak_to': ['electric', 'grass'], 'resists': ['fire', 'water', 'ice', 'steel'], 'immune_to': []},
        'electric': {'weak_to': ['ground'], 'resists': ['flying', 'steel', 'electric'], 'immune_to': []},
        'grass': {'weak_to': ['fire', 'ice', 'poison', 'flying', 'bug'], 'resists': ['ground', 'water', 'grass', 'electric'], 'immune_to': []},
        'ice': {'weak_to': ['fire', 'fighting', 'rock', 'steel'], 'resists': ['ice'], 'immune_to': []},
        'fighting': {'weak_to': ['flying', 'psychic', 'fairy'], 'resists': ['rock', 'bug', 'dark'], 'immune_to': []},
        'poison': {'weak_to': ['ground', 'psychic'], 'resists': ['fighting', 'poison', 'bug', 'grass'], 'immune_to': []},
        'ground': {'weak_to': ['water', 'grass', 'ice'], 'resists': ['poison', 'rock'], 'immune_to': ['electric']},
        'flying': {'weak_to': ['electric', 'ice', 'rock'], 'resists': ['fighting', 'bug', 'grass'], 'immune_to': []},
        'psychic': {'weak_to': ['bug', 'ghost', 'dark'], 'resists': ['fighting', 'psychic'], 'immune_to': []},
        'bug': {'weak_to': ['fire', 'flying', 'rock'], 'resists': ['fighting', 'ground', 'grass'], 'immune_to': []},
        'rock': {'weak_to': ['water', 'grass', 'fighting', 'ground', 'steel'], 'resists': ['normal', 'flying', 'poison', 'fire'], 'immune_to': []},
        'ghost': {'weak_to': ['ghost', 'dark'], 'resists': ['poison', 'bug'], 'immune_to': ['normal', 'fighting']},
        'dragon': {'weak_to': ['ice', 'dragon', 'fairy'], 'resists': ['fire', 'water', 'grass', 'electric'], 'immune_to': []},
        'dark': {'weak_to': ['fighting', 'bug', 'fairy'], 'resists': ['ghost', 'dark'], 'immune_to': ['psychic']},
        'steel': {'weak_to': ['fire', 'water', 'ground'], 'resists': ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'], 'immune_to': ['poison']},
        'fairy': {'weak_to': ['poison', 'steel'], 'resists': ['fighting', 'bug', 'dark'], 'immune_to': []},
    }
    
    def get(self, request, pk):
        try:
            team = Team.objects.get(pk=pk, user=request.user)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Team not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        pokemon_in_team = team.pokemon_in_team.all()
        
        if not pokemon_in_team.exists():
            return Response(
                {'error': 'Team has no Pokémon.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aggregate all types in the team
        all_types = []
        for pokemon in pokemon_in_team:
            all_types.extend(pokemon.types)
        
        # Calculate aggregated weaknesses and resistances
        weaknesses = {}
        resistances = {}
        immunities = {}
        
        for poke_type in set(all_types):
            if poke_type in self.TYPE_EFFECTIVENESS:
                effectiveness = self.TYPE_EFFECTIVENESS[poke_type]
                for weak_type in effectiveness['weak_to']:
                    weaknesses[weak_type] = weaknesses.get(weak_type, 0) + 1
                for res_type in effectiveness['resists']:
                    resistances[res_type] = resistances.get(res_type, 0) + 1
                for imm_type in effectiveness['immune_to']:
                    immunities[imm_type] = immunities.get(imm_type, 0) + 1
        
        # Sort by frequency
        sorted_weaknesses = sorted(weaknesses.items(), key=lambda x: x[1], reverse=True)
        sorted_resistances = sorted(resistances.items(), key=lambda x: x[1], reverse=True)
        
        return Response({
            'team_id': team.id,
            'team_name': team.name,
            'weaknesses': dict(sorted_weaknesses),
            'resistances': dict(sorted_resistances),
            'immunities': immunities,
            'pokemon_types': list(set(all_types)),
        }, status=status.HTTP_200_OK)


class TeamStatsView(APIView):
    """
    API view for aggregating team statistics.
    Returns combined stats of all Pokémon in the team.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            team = Team.objects.get(pk=pk, user=request.user)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Team not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        pokemon_in_team = team.pokemon_in_team.all()
        
        if not pokemon_in_team.exists():
            return Response(
                {'error': 'Team has no Pokémon.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aggregate stats
        aggregated_stats = {
            'hp': 0,
            'attack': 0,
            'defense': 0,
            'sp-atk': 0,
            'sp-def': 0,
            'speed': 0,
        }
        
        pokemon_details = []
        
        for pokemon in pokemon_in_team:
            stats = pokemon.stats
            for stat_name in aggregated_stats:
                aggregated_stats[stat_name] += stats.get(stat_name, 0)
            
            pokemon_details.append({
                'name': pokemon.name,
                'pokedex_id': pokemon.pokedex_id,
                'position': pokemon.position,
                'stats': stats,
            })
        
        # Calculate averages
        pokemon_count = pokemon_in_team.count()
        avg_stats = {stat: value / pokemon_count for stat, value in aggregated_stats.items()}
        
        return Response({
            'team_id': team.id,
            'team_name': team.name,
            'total_stats': aggregated_stats,
            'average_stats': avg_stats,
            'pokemon_count': pokemon_count,
            'pokemon_details': pokemon_details,
        }, status=status.HTTP_200_OK)