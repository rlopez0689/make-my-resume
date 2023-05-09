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
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/${candidateUUID}/export`, {
                headers: {
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            if (!response.ok) {
                const error = await response.json()
                res.status(response.status).json(error)
            }
            else {
                const resBlob = await response.blob();
                const resBufferArray = await resBlob.arrayBuffer();
                const resBuffer = Buffer.from(resBufferArray);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
                res.write(resBuffer, 'binary');
                res.end();
            }
        }
    }
}

export default apiHandler(handler)