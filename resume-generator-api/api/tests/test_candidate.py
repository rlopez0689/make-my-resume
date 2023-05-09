import uuid
import pytest
from model_bakery import baker

from rest_framework import status

from resume import models

BACKEND_URL = '/api/v1'
ENDPOINT = 'candidate'


@pytest.fixture
def create_candidate_record(api_client):
    def do_create_candidate_record(candidate_json):
        return api_client.post(
            f'{BACKEND_URL}/{ENDPOINT}/',
            candidate_json,
            format='json')
    return do_create_candidate_record


@pytest.fixture
def get_candidate_record(api_client):
    def do_get_candidate_record(candidate_uuid):
        return api_client.get(
            f'{BACKEND_URL}/{ENDPOINT}/{candidate_uuid}/')
    return do_get_candidate_record


@pytest.fixture
def get_candidate_collection(api_client):
    def do_get_candidate_collection():
        return api_client.get(f'{BACKEND_URL}/{ENDPOINT}/')
    return do_get_candidate_collection


@pytest.mark.django_db
class TestCandidate:

    def test_retrieve_candidate_record_returns_200(self, get_candidate_record):
        candidate = baker.make(models.Candidate)
        response = get_candidate_record(candidate.candidate_uuid)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == candidate.name

    def test_retrieve_non_existance_candidate_record_returns_404(self,
                                                                 get_candidate_record):
        candidate_uuid = uuid.uuid4()
        response = get_candidate_record(candidate_uuid)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_retrieve_with_bad_candidate_uuid_record_returns_404(self,
                                                                 get_candidate_record):
        bad_candidate_uuid = '1adfhadfas'
        response = get_candidate_record(bad_candidate_uuid)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_candidate_record_creation_returns_201(self,
                                                   create_candidate_record):
        candidate_json = {
            'name': 'Jonh Doe',
            'email': 'jonh.doe@test.com',
            'role': 'Developer'
        }
        response = create_candidate_record(candidate_json)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == candidate_json['name']

    def test_candidate_bad_request_resturns_400(self, create_candidate_record):
        candidate_json = {
            'name': 'Jonh Doe',
            'email': '',
            'role': 'Developer'
        }
        response = create_candidate_record(candidate_json)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_candidate_collection_returns_200(self,
                                                  get_candidate_collection):
        quantity = 5
        baker.make(models.Candidate, _quantity=quantity)
        response = get_candidate_collection()

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == quantity
