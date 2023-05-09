import uuid
import pytest
from model_bakery import baker

from rest_framework import status

from resume import models

BACKEND_URL = '/api/v1'
DOMAIN = 'candidate'
ENDPOINT = 'candidate-info'


@pytest.fixture
def create_candidate_info_record(api_client):
    def do_create_candidate_info_record(candidate_uuid, candidate_json):
        return api_client.post(
            f'{BACKEND_URL}/{DOMAIN}/{candidate_uuid}/{ENDPOINT}/',
            candidate_json,
            format='json')
    return do_create_candidate_info_record


@pytest.fixture
def get_candidate_info_record(api_client):
    def do_get_candidate_info_record(candidate_uuid):
        return api_client.get(
            f'{BACKEND_URL}/{DOMAIN}/{candidate_uuid}/{ENDPOINT}/')
    return do_get_candidate_info_record


@pytest.fixture
def update_candidate_info_record(api_client):
    def do_update_candidate_info_record(candidate_uuid, candidate_json):
        return api_client.patch(
            f'{BACKEND_URL}/{DOMAIN}/{candidate_uuid}/{ENDPOINT}/',
            candidate_json,
            format='json')
    return do_update_candidate_info_record


@pytest.mark.django_db
class TestCandidateInfo:

    def test_if_candidate_info_exists_returns_200(self,
                                                  get_candidate_info_record):
        candidate = baker.make(models.Candidate)
        candidate_info = baker.make(
            models.CandidateInfo, candidate=candidate)

        response = get_candidate_info_record(candidate.candidate_uuid)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['preferred_name'] == candidate_info.preferred_name

    def test_if_candidate_not_exists_resturns_404(self,
                                                  get_candidate_info_record):
        candidate = baker.make(models.Candidate)
        response = get_candidate_info_record(candidate.candidate_uuid)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_candidate_info_creation_returns_201(self,
                                                 create_candidate_info_record):
        candidate_info = {
            "skills": [{"name": "Python 2", "order": 0}],
            "certifications": [{"name": "AWS", "order": 0}],
            "preferred_name": "Jonh Doe",
            "role": "Developer",
            "profile": "Lorem ipsum dolor sit amet, consectetur adipiscing."
        }

        candidate = baker.make(models.Candidate)
        response = create_candidate_info_record(
            candidate.candidate_uuid, candidate_info)

        assert response.status_code == status.HTTP_201_CREATED
        print(candidate_info)
        assert response.data['preferred_name'] == \
            candidate_info['preferred_name']

    def test_candidate_info_creation_duplicated_returns_409(self,
                                                            create_candidate_info_record):
        candidate = baker.make(models.Candidate)
        baker.make(models.CandidateInfo, candidate=candidate)

        candidate_info = {
            "skills": [],
            "certifications": [],
            "preferred_name": "",
            "role": "",
            "profile": ""
        }

        response = create_candidate_info_record(
            candidate.candidate_uuid, candidate_info)

        assert response.status_code == status.HTTP_409_CONFLICT

    def test_candidate_info_updating_props_returns_200(self,
                                                       update_candidate_info_record):
        candidate = baker.make(models.Candidate)
        baker.make(models.CandidateInfo, candidate=candidate)

        new_candidate_info = {
            "skills": [{"name": "Python 2", "order": 0}],
            "certifications": [{"name": "AWS", "order": 0}],
            "preferred_name": "Jonh Doe",
            "role": "Developer",
            "profile": "Lorem ipsum dolor sit amet, consectetur adipiscing."
        }

        response = update_candidate_info_record(
            candidate.candidate_uuid, new_candidate_info)

        assert response.status_code == status.HTTP_200_OK

    def test_none_exists_candidate_info_updating_props_returns_404(self,
                                                                   update_candidate_info_record):
        none_candidate_uuid = uuid.uuid4()

        new_candidate_info = {
            "skills": [{"name": "Python 2", "order": 0}],
            "certifications": [{"name": "AWS", "order": 0}],
            "preferred_name": "Jonh Doe",
            "role": "Developer",
            "profile": "Lorem ipsum dolor sit amet, consectetur adipiscing."
        }

        response = update_candidate_info_record(
            none_candidate_uuid, new_candidate_info)

        assert response.status_code == status.HTTP_404_NOT_FOUND
