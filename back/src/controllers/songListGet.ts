import {AppDataSource} from "../data-source"
import {Request, Response} from 'express';
import {Song} from "../entities/Song";
import {User} from "../entities/User";
import jwt from "jsonwebtoken";

export const songListGet = async (req: Request, res: Response) => {
    if (process.env.JWT_SECRET === undefined) {
        console.error("ERROR: JWT_SECRET is empty");
        return res.status(500).send({message: "Server internal error. See console."});
    }
    try {
        const authorization = req.headers?.authorization?.split(" ") || [];
        let isAdmin = false;
        let user;

        if (authorization.length == 2 && authorization[0] === "Bearer") {
            try{
                const decoded = jwt.verify(authorization[1], process.env.JWT_SECRET);
                user = await AppDataSource.getRepository(User).findOneBy({
                    // @ts-ignore
                    vk_id: decoded.vk_id,
                    banned: false,
                    group: 1
                });

                isAdmin = user !== null
            }catch (e){
                // return res.status(401).s
            }
        }

        const songs = await AppDataSource.getRepository(Song).find({
            relations: {
                adder: true,
                likes: true,
                dislikes: true
            },
            where: {
                adder: {
                    banned: false
                }
            },
            select: {
                id: true,
                author: true,
                name: true,
                youtube: true,
                adder: {
                    id: isAdmin,
                    firstName: isAdmin,
                    lastName: isAdmin,
                    vk_id: isAdmin
                },
            }
        })

        const result = songs.map(s => {
            return {
                ...s,
                likes: s.likes.length,
                dislikes: s.dislikes.length,
                rating: s.likes.length - s.dislikes.length
            }
        })
            .sort((s1, s2) => s2.rating - s1.rating)

        return res.send({"success": true, result});
    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
}
