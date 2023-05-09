import { ExtendNextApiRequest } from "@/interfaces/ExtendedNextApiRequest";
import type { NextApiResponse } from "next";
import { apiHandler } from "../api-handler";

async function handler(
    req: ExtendNextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const query = req.query;
        const { candidateUUID } = query;
        if (candidateUUID) {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/${candidateUUID}/`, {
                headers: {
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            if (response.ok) {
                const results = await response.json()
                res.status(response.status).json(results)
            }
            else res.status(response.status).end()
        }
        else res.status(400).json({});
    }
}

export default apiHandler(handler)