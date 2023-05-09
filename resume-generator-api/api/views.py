import pdfkit
import os

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from rest_framework_simplejwt.views import TokenObtainPairView

from resume import models
from . import serializers
from . import utils


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = models.Candidate.objects.all()
    serializer_class = serializers.CandidateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['email', 'name', 'candidate_uuid', 'role', 'last_edited']
    ordering = ['-last_edited']

    def get_serializer_class(self):
        if self.action == 'candidate_info':
            return serializers.CandidateInfoSerializer
        if self.action == 'candidate_professional_experience':
            return serializers.CandidateProfessionalExperienceSerializer
        return self.serializer_class

    def retrieve(self, request, pk=None):
        try:
            candidate = get_object_or_404(
                self.get_queryset(), candidate_uuid=pk)
            serializer = self.get_serializer(candidate)
            return Response(serializer.data)

        except ValidationError:
            return Response({"detail": "Not found."},
                            status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], detail=True)
    def export(self, request, pk=None):
        template = 'pdf/candidate_resume.html'
        banner = 'static/img/logotype-horizontal.png'

        pdf_options = {
            'enable-local-file-access': "",
            'page-size': 'A4',
            'encoding': "UTF-8",
            'no-outline': None
        }

        candidate = get_object_or_404(models.Candidate, candidate_uuid=pk)
        if not hasattr(candidate, 'info_candidates') or candidate.professional_candidates.count() < 1:
            return Response(data="Not allowed to generate PDF. Please be sure to have basic information and professional experience",
                            status=status.HTTP_400_BAD_REQUEST)

        html_template = get_template(template).render({
            'candidate_info': candidate.info_candidates,
            'candidate_experiences': candidate.professional_candidates.all(),
            'last_revision': candidate.last_edited
        })

        pdf_file = pdfkit.from_string(html_template, False, pdf_options)

        response = HttpResponse(pdf_file, content_type='application/pdf')
        filename = 'test.pdf'
        response['Content-Disposition'] = f'attachment;filename = "{filename}"'
        return response

    @action(detail=True, methods=['get', 'post', 'patch'], url_path='candidate-info')
    def candidate_info(self, request, pk=None):
        status_code = status.HTTP_200_OK
        candidate_info = None

        skills = request.data.pop('skills', [])
        certifications = request.data.pop('certifications', [])

        if request.method == 'GET':
            candidate_info = get_object_or_404(
                models.CandidateInfo, candidate__candidate_uuid=pk)
            status_code = status.HTTP_200_OK

        if request.method == 'POST':
            candidate = get_object_or_404(
                self.get_queryset(), candidate_uuid=pk)

            try:
                candidate_info = models.CandidateInfo.objects.create(
                    candidate=candidate, **request.data)
                status_code = status.HTTP_201_CREATED

            except IntegrityError:
                status_code = status.HTTP_409_CONFLICT

        if request.method == 'PATCH':
            candidate_info = get_object_or_404(models.CandidateInfo,
                                               candidate__candidate_uuid=pk)
            candidate_info.role = request.data.get('role')
            candidate_info.profile = request.data.get('profile')
            candidate_info.preferred_name = request.data.get('preferred_name')
            candidate_info.save()

            models.Skill.objects.filter(candidate_info=candidate_info).delete()
            models.Certification.objects.filter(
                candidate_info=candidate_info).delete()

        for skill in skills:
            models.Skill.objects.create(
                candidate_info=candidate_info, **skill)

        for certification in certifications:
            models.Certification.objects.create(
                candidate_info=candidate_info, ** certification)

        serializer = self.get_serializer(candidate_info)
        return Response(serializer.data, status_code)

    @action(detail=True, methods=['get', 'post'], url_path='candidate-professional-experience')
    def candidate_professional_experience(self, request, pk=None):
        experience_entries = None
        technologies = request.data.pop('technologies', [])
        responsibilities = request.data.pop('responsibilities', [])
        serializer = None
        status_code = None

        if request.method == 'GET':
            experience_entries = models.CandidateProfessionalExperience.objects.filter(
                candidate__candidate_uuid=pk
            ).order_by('-pk')
            serializer = self.get_serializer(experience_entries, many=True)
            status_code = status.HTTP_200_OK

        if request.method == 'POST':
            candidate = get_object_or_404(
                self.get_queryset(), candidate_uuid=pk)

            cpx_record = models.CandidateProfessionalExperience.objects.create(
                candidate=candidate, **request.data)

            serializer = self.get_serializer(cpx_record)

            for technology in technologies:
                models.Technology.objects.create(
                    candidate_professional_experience=cpx_record, **technology)

            for responsibility in responsibilities:
                models.Responsibility.objects.create(
                    candidate_professional_experience=cpx_record, **responsibility)

            status_code = status.HTTP_201_CREATED

        return Response(serializer.data, status=status_code)


class CandidateProfessionalExperienceViewSet(viewsets.ModelViewSet):
    queryset = models.CandidateProfessionalExperience.objects.all().order_by('-company')
    serializer_class = serializers.CandidateProfessionalExperienceSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, pk=None, partial=None):
        technologies = request.data.pop('technologies')
        responsibilities = request.data.pop('responsibilities')

        cpx_record = self.get_queryset().get(pk=pk)
        cpx_record.role = request.data.pop('role')
        cpx_record.company = request.data.pop('company')
        cpx_record.period = request.data.pop('period')
        cpx_record.industry = request.data.pop('industry')
        cpx_record.use_case = request.data.pop('use_case')
        cpx_record.save()

        models.Technology.objects.filter(
            candidate_professional_experience=cpx_record).delete()
        models.Responsibility.objects.filter(
            candidate_professional_experience=cpx_record).delete()

        for technology in technologies:
            models.Technology.objects.create(
                candidate_professional_experience=cpx_record, **technology)

        for responsibility in responsibilities:
            models.Responsibility.objects.create(
                candidate_professional_experience=cpx_record, **responsibility)

        serializer = self.get_serializer(cpx_record)
        return Response(serializer.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer
