import pytest
from model_bakery import baker

from rest_framework import status

from resume import models

ENDPOINT = 'candidate-professional-experience'


@pytest.fixture
def retrieve_professional_experience_record(api_client):
    def do_retrieve_professional_experience_record(pe_id):
        return api_client.get(
            f'/api/v1/{ENDPOINT}/{pe_id}/')
    return do_retrieve_professional_experience_record


@pytest.fixture
def get_professional_experience_collection(api_client):
    def do_get_professional_experience_collection():
        return api_client.get(
            f'/api/v1/{ENDPOINT}/')
    return do_get_professional_experience_collection


@pytest.fixture
def update_professional_experience_record(api_client):
    def do_update_professional_experience_record(pe_id, pe_json):
        return api_client.patch(
            f'/api/v1/{ENDPOINT}/{pe_id}/',
            pe_json,
            format='json')
    return do_update_professional_experience_record


@pytest.fixture
def delete_professional_experience_record(api_client):
    def do_delete_professional_experience_record(pd_id):
        return api_client.delete(
            f'/api/v1/{ENDPOINT}/{pd_id}/')
    return do_delete_professional_experience_record


@pytest.mark.django_db
class TestProfessionalExperience:

    def test_retreiving_pe_returns_200(self,
                                       retrieve_professional_experience_record):

        candidate = baker.make(models.Candidate)
        prefessional_experience = baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate,
        )

        response = retrieve_professional_experience_record(
            prefessional_experience.id)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['role'] == prefessional_experience.role

    def test_retreiving_not_existing_pe_returns_404(self,
                                                    retrieve_professional_experience_record):

        prefessional_experience_id = 1000
        candidate = baker.make(models.Candidate)
        baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate
        )

        response = retrieve_professional_experience_record(
            prefessional_experience_id)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_pe_collection_returns_200(self,
                                           get_professional_experience_collection):

        quantity_one = 5
        quantity_two = 5

        candidate_one = baker.make(models.Candidate)
        baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate_one,
            _quantity=quantity_one
        )

        candidate_two = baker.make(models.Candidate)
        baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate_two,
            _quantity=quantity_two
        )

        response = get_professional_experience_collection()

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == quantity_one + quantity_two

    def test_update_pe_record_returns_200(self,
                                          update_professional_experience_record):

        candidate = baker.make(models.Candidate)
        pe = baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate)

        pe_json = {
            "responsibilities": [],
            "technologies": [],
            "role": pe.role,
            "company": pe.company,
            "period": pe.period,
            "industry": pe.industry,
            "use_case": "Other usecase",
        }

        response = update_professional_experience_record(
            pe.id, pe_json)

        assert response.status_code == status.HTTP_200_OK

    def test_delete_pe_record_returns_204(self,
                                          delete_professional_experience_record,
                                          get_professional_experience_collection):

        pe_id = 1
        candidate = baker.make(models.Candidate)
        collection = baker.make(
            models.CandidateProfessionalExperience,
            candidate=candidate,
            _quantity=2)

        response = delete_professional_experience_record(pe_id)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        response = get_professional_experience_collection()

        assert len(response.data) == 1
        assert response.data[0]['id'] == collection[1].id
