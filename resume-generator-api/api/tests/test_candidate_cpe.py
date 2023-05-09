import pytest
from model_bakery import baker

from rest_framework import status

from resume import models


BACKEND_URL = '/api/v1'
DOMAIN = 'candidate'
ENDPOINT = 'candidate-professional-experience'


@pytest.fixture
def create_candidate_professional_experience(api_client):
    def do_create_professional_experience(candidate_uuid, candidate_pe):
        return api_client.post(
            f'{BACKEND_URL}/{DOMAIN}/{candidate_uuid}/{ENDPOINT}/',
            candidate_pe,
            format='json')
    return do_create_professional_experience


@pytest.fixture
def get_candidate_pe_collection(api_client):
    def do_get_candidate_pe_collection(candidate_uuid):
        return api_client.get(
            f'{BACKEND_URL}/{DOMAIN}/{candidate_uuid}/{ENDPOINT}/'
        )
    return do_get_candidate_pe_collection


@pytest.mark.django_db
class TestCandidateProfessionalExperience:

    def test_retreiving_candidate_pe_collection_returns_200(self,
                                                            get_candidate_pe_collection):
        candidate = baker.make(models.Candidate)
        baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate)
        baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate)

        response = get_candidate_pe_collection(
            candidate.candidate_uuid)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_candidate_pe_creation_returns_201(self,
                                               create_candidate_professional_experience):
        candidate = baker.make(models.Candidate)
        candidate_pe = {
            "responsibilities": [{"order": 0, "name": "Code reviewer"}],
            "technologies": [{"order": 0, "name": "AWS"}],
            "role": "Developer",
            "company": "Microsoft",
            "period": "Jan 2020 - Dec 2021",
            "industry": "Information Techonlogy",
            "use_case": "Developer"
        }
        response = create_candidate_professional_experience(
            candidate.candidate_uuid, candidate_pe
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['role'] == candidate_pe['role']
