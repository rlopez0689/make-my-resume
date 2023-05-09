import type { NextApiResponse } from 'next'

import { apiHandler } from './api-handler'
import { ExtendNextApiRequest } from '@/interfaces/ExtendedNextApiRequest'


export type ResumeList = {
    id: string
    name: string
    email: string
    role: string
    candidate_uuid: string
    last_edited: string
}


async function handler(
    req: ExtendNextApiRequest,
    res: NextApiResponse<ResumeList[]>
) {
    if (req.method === 'GET') {
        try {
            const { search } = req.query
            const extraParams = (search && search !== '') ? `?search=${search}` : ''
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/${extraParams}`, {
                headers: {
                    "Authorization": `Bearer ${req.accessToken}`
                }
            });
            if (response.ok) {
                const results = await response.json()
                res.status(response.status).json(results)
            }
            else
                res.status(response.status).end()
        } catch (error) {
            res.status(500).end()
        }
    }
    else if (req.method === 'POST') {
        try {
            const response = await fetch(`${process.env.BACKEND_API_URL}/candidate/`, {
                method: 'POST',
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
            else
                res.status(response.status).end()
        } catch (error) {
            res.status(500).end()
        }
    }
}

export default apiHandler(handler)