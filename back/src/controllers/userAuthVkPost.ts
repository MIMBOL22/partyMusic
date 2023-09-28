import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import jwt from "jsonwebtoken";

export const userAuthVkPost = async (req, res) => {
    try {
        if (process.env.VK_SERVICE_TOKEN == null) {
            console.error("FATAL ERROR: VK_SERVICE_TOKEN is null")
            return res.status(500).send({message: "Server internal error. See console."})
        }

        if (req.body.silent_token == undefined) return res.status(400).send({message: "silent_token is not defined"})
        if (req.body.uuid == undefined) return res.status(400).send({message: "uuid is not defined"})


        const vkIdAcTok = new URLSearchParams({
            v: "5.131",
            token: req.body.silent_token,
            access_token: process.env.VK_SERVICE_TOKEN,
            uuid: req.body.uuid
        });

        const api_response = await fetch("https://api.vk.com/method/auth.exchangeSilentAuthToken", {
            method: 'POST',
            body: vkIdAcTok.toString(),
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            redirect: 'follow'
        })
            .then(r => r.json())
            .then(r => r.response)

        let user = await AppDataSource.getRepository(User).findOneBy({
            vk_id: api_response.user_id
        })

        if (user === null){
            user = new User();
            user.accessToken = api_response.access_token
            user.vk_id = api_response.user_id
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            await user.save()
        }

        const accessToken = jwt.sign({
            vk_id: user.vk_id,
            banned: user.banned,
            group: user.group
        }, process.env.JWT_SECRET as string, {expiresIn: process.env.JWT_EXPIRESIN});

        res.send({status:"ok", accessToken})

    } catch (e) {
        console.error("FATAR ERROR:", e);
        return res.status(500).send({message: "Server internal error. See console."})
    }
}
