import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import { Song } from "../entities/Song";

export const userSongs = async (req: Request, res: Response) => {
    if (process.env.JWT_SECRET === undefined) {
        console.error("ERROR: JWT_SECRET is empty");
        return res.status(500).send({message: "Server internal error. See console."});
    }
    try {
        const authorization = req.headers?.authorization?.split(" ") || [];
        if (authorization.length < 2) return res.status(401).send({message: "JWT Token is not defined in headers"});
        if (authorization[0] !== "Bearer") return res.status(400).send({message: "JWT Token is not Bearer token"});

        jwt.verify(authorization[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err){
                if (err.name == "TokenExpiredError"){
                    res.status(401).send({message: "JWT Token expired"});
                } else {
                    res.status(400).send({message: "JWT error: "+err.message});
                }
                return;
            }

            // @ts-ignore
            if (decoded.vk_id == undefined) return res.status(401).send({message: "vk_id in JWT is null"});

            const user = await AppDataSource.getRepository(User).findOneBy({
                // @ts-ignore
                vk_id: decoded.vk_id,
                banned: false
            })
            if (user === null) return res.status(500).send({message: "User not found"})

            const songList = await AppDataSource.getRepository(Song).findBy({
                adder: {
                    id: user.id
                }
            })

            return res.send({"success":true, result: songList?.length || 0});
        });

    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
    return;
}
