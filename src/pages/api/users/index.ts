import {NextApiRequest, NextApiResponse} from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1, name: "joseph"},
        { id: 2, name: "Seraph"}
    ]

    return response.json(users);
}