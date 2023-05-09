export type ProfessionalExperienceData = {
    id: number;
    role: string;
    company: string;
    period: string;
    industry: string;
    use_case: string;
    responsibilities: string[];
    technologies: string[];
};

export type CandidateInfo = {
    id: number;
    candidate: number;
    preferred_name: string;
    profile: string;
    role: string;
    last_edited: string;
    skills: string[];
    certifications: string[];
};

export type Candidate = {
    id: number;
    altid: string;
    name: string;
    role: string;
    candidate_uuid: string;
};