import dotenv from "dotenv"
import express from "express"

import { getUserInfo } from "./function.js";

dotenv.config()

const router = express.Router()

router.get("/:users_id", async(req, res) => {
    try {
        const p = await getUserInfo(req.params)
        console.log('pppppp', p)
        res.status(200).send({data : p})
    } catch (error) {
        console.error("err", error)
        throw error
    }
})


export default router;