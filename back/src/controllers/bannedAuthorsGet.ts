import {AppDataSource} from "../data-source"
import {Request, Response} from 'express';
import {BannedAuthors} from "../entities/BannedAuthors.js";

export const bannedAuthorsGet = async (req: Request, res: Response) => {
    if (process.env.JWT_SECRET === undefined) {
        console.error("ERROR: JWT_SECRET is empty");
        return res.status(500).send({message: "Server internal error. See console."});
    }
    try {
        const bannedAuthors = await AppDataSource.getRepository(BannedAuthors).find()
        return res.send({"success": true, result: bannedAuthors});
    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
}
