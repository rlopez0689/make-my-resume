from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views

router = DefaultRouter()
router.register(r'candidate', views.CandidateViewSet)
router.register(r'candidate-professional-experience',
                views.CandidateProfessionalExperienceViewSet)


urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

app_name = 'api'
