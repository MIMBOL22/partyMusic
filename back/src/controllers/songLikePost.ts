import {User} from "../entities/User"
import {AppDataSource} from "../data-source"
import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {Song} from "@server/entities/Song";

export const songLikePost = async (req: Request, res: Response) => {
    if (process.env.JWT_SECRET === undefined) {
        console.error("ERROR: JWT_SECRET is empty");
        return res.status(500).send({message: "Server internal error. See console."});
    }

    try {
        if (req.body.song_id == undefined) return res.status(400).send({message: "song_id is not defined"});

        const authorization = req.headers?.authorization?.split(" ") || [];
        if (authorization.length < 2) return res.status(401).send({message: "JWT Token is not defined in headers"});
        if (authorization[0] !== "Bearer") return res.status(400).send({message: "JWT Token is not Bearer token"});

        return jwt.verify(authorization[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err !== null || decoded === undefined) {
                if (err?.name == "TokenExpiredError") {
                    res.status(401).send({message: "JWT Token expired"});
                } else {
                    res.status(400).send({message: "JWT error: " + err?.message});
                }
                return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (decoded.vk_id == undefined) return res.status(401).send({message: "vk_id in JWT is null"});

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const user = await AppDataSource.getRepository(User).findOne({
                where: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    vk_id: decoded.vk_id,
                    banned: false
                },
                relations: {
                    likes: true,
                    dislikes: true,
                }
            })
            if (user === null) return res.status(500).send({message: "User not found"})

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const song = await AppDataSource.getRepository(Song).findOneBy({
                id: req.body.song_id
            })
            if (song === null) return res.status(500).send({message: "Song not found"})

            const songIndexLikes = user.likes.indexOf(song as Song);
            const songIndexDislikes = user.dislikes.indexOf(song as Song);

            if (songIndexDislikes !== -1) {
                user.dislikes = user.dislikes.filter((a,k)=> k !== songIndexDislikes)
            }

            if (songIndexLikes === -1) {
                user.likes.push(song);
            }

            return res.send({"success": true});
        });

    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
}
