import { NewUser } from "@/components/NewUserModal";
import { ResumeList } from "@/pages/api/resumes";
import { Candidate, CandidateInfo, ProfessionalExperienceData } from "@/shared/resumesTypes";
import axios from "axios";

axios.interceptors.response.use(
    (res) => {
        if (res.status == 401) {
            throw new Error("Authentication Error");
        }
        return res;
    },
    (err) => {
        if (err.response.status == 401) {
            throw new Error("Authentication Error");
        }
        throw err
    }
);

const fetchEmployees = async (
    debouncedSearchTerm: string
): Promise<ResumeList[]> => {
    const extraParams =
        debouncedSearchTerm && debouncedSearchTerm !== ""
            ? `?search=${debouncedSearchTerm}`
            : "";
    const res = await axios.get(`/api/resumes${extraParams}`)
    return res.data;
};

const fetchEmployee = async (
    candidate_uuid: string | undefined
): Promise<Candidate> => {
    const res = await axios.get(`/api/candidate/${candidate_uuid}`)
    return res.data;
};

const postEmployee = async (data: NewUser) => {
    const res = await axios.post("/api/resumes", data)
    return res.data
}

const fetchCandidateInfo = async (
    candidate_uuid: string
): Promise<CandidateInfo> => {
    const res = await axios.get(`/api/candidate-info/${candidate_uuid}`)
    return res.data
};

const fetchCandidateProfessionalExperiences = async (
    candidate_uuid: string
): Promise<ProfessionalExperienceData[]> => {
    const res = await axios.get(`/api/candidate-professional-experience/${candidate_uuid}`)
    return res.data
};

const postBasicInformation = async (candidateUUID: string, method: string, data: {
    skills: {
        name: string;
        order: number;
    }[];
    certifications: {
        name: string;
        order: number;
    }[];
    id: number;
    candidate: number;
    preferred_name: string;
    profile: string;
    role: string;
    last_edited: string
}) => {
    const url = `/api/candidate-info/${candidateUUID}/`;

    if (method === "POST") {
        const res = await axios.post(url, data)
        return res.data
    }
    if (method === "PATCH") {
        const res = await axios.patch(url, data)
        return res.data
    }
}

const deleteProfessionalExperience = async (id: number) => {
    const res = await axios.delete(`/api/experience/${id}/`)
    return res.data
}

const postProfessionalExperience = async (candidateUUID: string, method: string, isNewMode: boolean, experienceID: number | undefined, data: {
    responsibilities: {
        name: string;
        order: number;
    }[];
    technologies: {
        name: string;
        order: number;
    }[];
    id: number;
    role: string;
    company: string;
    period: string;
    industry: string;
    use_case: string;
}) => {
    const url = isNewMode
        ? `/api/candidate-professional-experience/${candidateUUID}/`
        : `/api/experience/${experienceID}/`;

    if (method === "POST") {
        const res = await axios.post(url, data)
        return res.data
    }
    if (method === "PATCH") {
        const res = await axios.patch(url, data)
        return res.data
    }
}

const fetchResumeFile = async (uuid: string) => {
    const res = await axios.get(`/api/resume-file/${uuid}/`, {
        responseType: 'blob',
    })
    return res;
}

export { fetchEmployees, fetchEmployee, postEmployee, fetchCandidateInfo, fetchCandidateProfessionalExperiences, postBasicInformation, deleteProfessionalExperience, postProfessionalExperience, fetchResumeFile }