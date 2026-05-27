from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'api'

router = DefaultRouter()
# We'll add viewsets here as we create them
# router.register(r'pokemon', views.PokemonViewSet, basename='pokemon')
# router.register(r'teams', views.TeamViewSet, basename='team')

urlpatterns = [
    path('', include(router.urls)),
    
    # Pokemon search endpoint
    path('pokemon/search/', views.PokemonSearchView.as_view(), name='pokemon-search'),
    
    # Team endpoints
    path('teams/', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('teams/<int:pk>/analyze/', views.TeamAnalyzeView.as_view(), name='team-analyze'),
    path('teams/<int:pk>/stats/', views.TeamStatsView.as_view(), name='team-stats'),
    path('teams/<int:pk>/slot/<int:position>/', views.TeamSlotAssignView.as_view(), name='team-slot-assign'),
]