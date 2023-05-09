import { NextApiResponse } from "next";
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from "next-auth/next";
import { ExtendNextApiRequest } from "@/interfaces/ExtendedNextApiRequest";

export function apiHandler(handler: (arg0: ExtendNextApiRequest, arg1: NextApiResponse<any>) => any) {
    return async (req: ExtendNextApiRequest, res: NextApiResponse) => {
        let accessToken;
        try {
            const session = await getServerSession(req, res, authOptions)
            accessToken = session.accessToken
            req.accessToken = accessToken
            return handler(req, res);
        }
        catch (error) {
            res.status(401).end();
        }
    };
}
