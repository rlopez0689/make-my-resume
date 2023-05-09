import pytest

from rest_framework.test import APIClient

from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def create_user(django_user_model):
    def do_create_user(**kwargs):
        kwargs['password'] = 'password'
        return django_user_model.objects.create_user(**kwargs)
    return do_create_user


@pytest.fixture
def get_or_create_token(create_user):
    def do_get_or_create_token(provider):
        common_user = create_user(username="user")
        token = provider.for_user(common_user)
        return token
    return do_get_or_create_token


@pytest.fixture
def api_client(get_or_create_token):
    api_client = APIClient()
    token = get_or_create_token(RefreshToken)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
    return api_client
