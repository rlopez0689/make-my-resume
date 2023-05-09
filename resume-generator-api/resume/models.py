import uuid
from django.db import models
from django.dispatch import receiver


class Candidate(models.Model):
    """
    A Candidate represents a colaborator. This collaborator might be either on pool or project.
    """
    email = models.EmailField(
        unique=True,
        verbose_name='E-mail'
    )
    name = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    candidate_uuid = models.UUIDField(
        primary_key=False,
        default=uuid.uuid4,
        editable=False
    )
    role = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )
    last_edited = models.DateTimeField(
        blank=True,
        null=True,
        auto_now=True,
        verbose_name='Last Edited'
    )

    class Meta:
        ordering = ['last_edited']

    def __str__(self) -> str:
        return self.name


class CandidateInfo(models.Model):
    """
    Represents the candidate resume metadata.
    """
    preferred_name = models.CharField(
        max_length=50,
        verbose_name='Preferred Name'
    )
    role = models.CharField(
        max_length=30,
    )
    profile = models.TextField()
    candidate = models.OneToOneField(
        to='resume.Candidate',
        on_delete=models.CASCADE,
        related_name='info_candidates'
    )
    last_edited = models.DateField(
        auto_now=True,
        verbose_name='Last Edited'
    )

    class Meta:
        ordering = ['preferred_name']

    def __str__(self) -> str:
        return self.preferred_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        candidate = self.candidate
        if self.preferred_name:
            candidate.name = self.preferred_name
        if self.role:
            candidate.role = self.role
        candidate.save()


class Skill(models.Model):
    """
    Represents a candidate's hard skill. Tipically any learned technology
    """
    name = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    order = models.BigIntegerField()
    candidate_info = models.ForeignKey(
        to='resume.CandidateInfo',
        on_delete=models.CASCADE,
        related_name='skills'
    )

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['order', 'candidate_info']

    def __str__(self) -> str:
        return self.name


class Certification(models.Model):
    """
    Represents a candidate certified. Tipically any certification taken
    """
    name = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    order = models.BigIntegerField()
    candidate_info = models.ForeignKey(
        to='resume.CandidateInfo',
        on_delete=models.CASCADE,
        related_name='certifications'
    )

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['order', 'candidate_info']

    def __str__(self) -> str:
        return self.name


class CandidateProfessionalExperience(models.Model):
    """
    Represents the candidate professional experience in a certain period of time.
    """
    role = models.CharField(
        max_length=30,
        blank=False,
        null=False,
    )
    company = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    period = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    industry = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    use_case = models.TextField(
        blank=False,
        verbose_name='Use case'
    )
    candidate = models.ForeignKey(
        to='resume.Candidate',
        on_delete=models.CASCADE,
        related_name='professional_candidates'
    )
    last_edited = models.DateField(
        auto_now=True,
        verbose_name='Last Edited'
    )

    class Meta:
        # Search by id
        ordering = ['company']

    def __str__(self) -> str:
        return self.company

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        candidate = self.candidate
        candidate.save()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        candidate = self.candidate
        candidate.save()


class Responsibility(models.Model):
    """
    Represents a candidate main ocupations in a certain period of time.
    """
    name = models.CharField(
        max_length=250,
        blank=False,
        null=False
    )
    order = models.BigIntegerField()
    candidate_professional_experience = models.ForeignKey(
        to='resume.CandidateProfessionalExperience',
        on_delete=models.CASCADE,
        related_name='responsibilities'
    )

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['order', 'candidate_professional_experience']

    def __str__(self) -> str:
        return self.name


class Technology(models.Model):
    """
    Specifies a tech used by the candidate to fullfill tasks in a certain period of time.
    """
    name = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    order = models.BigIntegerField()
    candidate_professional_experience = models.ForeignKey(
        to='resume.CandidateProfessionalExperience',
        on_delete=models.CASCADE,
        related_name='technologies'
    )

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['order', 'candidate_professional_experience']

    def __str__(self) -> str:
        return self.name
