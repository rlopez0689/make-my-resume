import { ExtendNextApiRequest } from "@/interfaces/ExtendedNextApiRequest";
import type { NextApiResponse } from "next";
import { apiHandler } from "../api-handler";


async function handler(
    req: ExtendNextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        const query = req.query;
        const { id } = query;
        try {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate-professional-experience/${id}/`, {
                method: req.method,
                headers: {
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            res.status(response.status).end()
        } catch (error) { res.status(500).json(error) }

    }
    if (req.method === "PATCH") {
        const query = req.query;
        const { id } = query;
        try {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate-professional-experience/${id}/`, {
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

}


export default apiHandler(handler)