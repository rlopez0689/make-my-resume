import { ExtendNextApiRequest } from "@/interfaces/ExtendedNextApiRequest";
import type { NextApiResponse } from "next";
import { apiHandler } from "../api-handler";

async function handler(
    req: ExtendNextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const query = req.query;
        const { candidateUUID } = query;
        try {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/${candidateUUID}/candidate-professional-experience/`, {
                method: req.method,
                body: JSON.stringify(req.body),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            if (response.ok) {
                const results = await response.json()
                res.status(response.status).json(results)
            }
            else res.status(response.status).end()
            
        } catch (error) { res.status(500).json(error) }
    }
    if (req.method === "GET") {
        const query = req.query;
        const { candidateUUID } = query;
        try {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/${candidateUUID}/candidate-professional-experience`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            if (response.ok) {
                const results = await response.json()
                const cleanResults = results.map((experience: { technologies: { name: string; }[]; responsibilities: { name: string; }[]; }) => {
                    const newTechnologies = experience.technologies.map((technology: { name: string; }) => technology.name)
                    const newResponsibilities = experience.responsibilities.map((resp: { name: string; }) => resp.name)

                    return {
                        ...experience,
                        technologies: newTechnologies,
                        responsibilities: newResponsibilities
                    }
                })
                res.status(response.status).json(cleanResults)
            }
            else if (response.status === 404) {
                res.status(200).json({})
            }
            else res.status(response.status).end()
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default apiHandler(handler)