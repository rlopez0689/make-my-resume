from django.contrib import admin
from . import models


class CandidateAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'email', 'name', 'role', 'candidate_uuid', 'last_edited']


class CandidateInfoAdmin(admin.ModelAdmin):
    list_display = ['id', 'preferred_name', 'last_edited']


class SkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


class CertificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


class CandidateProfessionalExperienceAdmin(admin.ModelAdmin):
    list_display = ['id', 'company', 'period', 'last_edited']


class ResponsibilityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


admin.site.register(models.Candidate, CandidateAdmin)
admin.site.register(models.CandidateInfo, CandidateInfoAdmin)
admin.site.register(models.Skill, SkillAdmin)
admin.site.register(models.Certification, CertificationAdmin)
admin.site.register(models.CandidateProfessionalExperience,
                    CandidateProfessionalExperienceAdmin)
admin.site.register(models.Responsibility, ResponsibilityAdmin)
admin.site.register(models.Technology, TechnologyAdmin)
