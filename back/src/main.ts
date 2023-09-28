import "reflect-metadata"
import 'dotenv/config'

import express from 'express';
import bodyParser from "body-parser";
import {xss} from "express-xss-sanitizer"

import {AppDataSource} from "./data-source.js";

import { userAuthVkPost } from "./controllers/userAuthVkPost.js";
import { songAddPost } from "./controllers/songAddPost.js";
import { songListGet } from "./controllers/songListGet.js";
import { userBanPut } from "./controllers/userBanPut.js";
import { userDislikesGet } from "./controllers/userDislikesGet.js";
import { userLikesGet } from "./controllers/userLikesGet.js";
import { songDislikePost } from "./controllers/songDislikePost.js";
import { songLikePost } from "./controllers/songLikePost.js";

if (process.env.JWT_SECRET === undefined){
    console.error("ERROR: JWT_SECRET is empty");
}else{
    const app = express();

    app.use(bodyParser.json({limit: '1kb'}));
    app.use(xss());


    app.post("/user/auth/vk/", userAuthVkPost);
    app.get("/user/dislikes/", userDislikesGet);
    app.get("/user/likes/", userLikesGet);

    app.post("/song/add/", songAddPost);
    app.get("/song/list/", songListGet);
    app.post("/song/dislike/", songDislikePost);
    app.post("/song/like/", songLikePost);

    app.put("/user/ban/", userBanPut);



    AppDataSource.initialize()
        .then(() => {
            app.listen(8080, function () {
                console.log('running');
            });
        })
        .catch((error) => console.log(error))
}




