from resume import models

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CandidateSerializer(serializers.ModelSerializer):
    last_edited = serializers.DateTimeField(format="%B %d, %Y", read_only=True)

    class Meta:
        model = models.Candidate
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Skill
        fields = ['name', 'order']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Certification
        fields = ['name', 'order']


class CandidateInfoSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True)
    certifications = CertificationSerializer(many=True)

    class Meta:
        model = models.CandidateInfo
        fields = '__all__'
        read_only_fields = ('candidate',)


class ResponsibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Responsibility
        fields = ['name', 'order']


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Technology
        fields = ['name', 'order']


class CandidateProfessionalExperienceSerializer(serializers.ModelSerializer):
    responsibilities = ResponsibilitySerializer(many=True)
    technologies = TechnologySerializer(many=True)

    class Meta:
        model = models.CandidateProfessionalExperience
        fields = '__all__'
        read_only_fields = ('candidate',)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token
