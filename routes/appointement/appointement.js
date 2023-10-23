import dotenv from "dotenv"
import express from "express"

import { poolPromise } from "../../config/db.js";
import { getIncomingAppointement } from "./function.js";

dotenv.config()

const router = express.Router()

router.get("/appointements/:users_id", async (req, res) => {
    try {
        const p = await getIncomingAppointement(req.params)
        console.log('pppppp',p)
        res.status(200).send('test')
    } catch (error) {
        console.error(error)
    }
})

export default router;