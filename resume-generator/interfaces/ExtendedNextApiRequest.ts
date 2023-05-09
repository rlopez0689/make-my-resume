import { NextApiRequest } from "next"

type RequestType = {
    accessToken: string
}

export type ExtendNextApiRequest = RequestType & NextApiRequest