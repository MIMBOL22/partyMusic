import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import { Song } from "../entities/Song";

export const songAddPost = async (req: Request, res: Response) => {
    try {
        if (req.body.track_name == undefined) return res.status(400).send({message: "track_name is not defined"});
        if (req.body.track_name.length > 32) return res.status(400).send({message: "track_name is so long (>32)"});

        if (req.body.track_author == undefined) return res.status(400).send({message: "track_author is not defined"});
        if (req.body.track_author.length > 32) return res.status(400).send({message: "track_author is so long (>32)"});

        if (req.body.track_url !== undefined)
            if (req.body.track_url.length > 32) return res.status(400).send({message: "track_url is so long (>32)"});

        const authorization = req.headers?.authorization?.split(" ") || [];
        if (authorization.length < 2) return res.status(401).send({message: "JWT Token is not defined in headers"});
        if (authorization[0] !== "Bearer") return res.status(400).send({message: "JWT Token is not Bearer token"});

        return jwt.verify(authorization[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err){
                if (err.name == "TokenExpiredError"){
                    res.status(401).send({message: "JWT Token expired"});
                } else {
                    res.status(400).send({message: "JWT error: "+err.message});
                }
                return;
            }

            if (decoded.vk_id == undefined) return res.status(401).send({message: "vk_id in JWT is null"});

            const user = await AppDataSource.getRepository(User).findOneBy({
                vk_id: decoded.vk_id,
                banned: false
            })
            if (user === null) return res.status(500).send({message: "User not found"})

            const song = new Song();
            song.author = req.body.track_author;
            song.name = req.body.track_name;
            song.youtube = req.body.track_url;
            song.adder = user;
            song.likes = [user];
            song.save();

            return res.send({"success":true});
        });

    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
}