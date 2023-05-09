import { NextApiRequest } from "next";


type ExtendedRequest = {
    accessToken: string;
};
export type ExtendNextApiRequest = ExtendedRequest & NextApiRequest;