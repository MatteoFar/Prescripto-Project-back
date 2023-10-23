import dotenv from "dotenv"
import express from "express"

import { poolPromise } from "../../config/db.js";
import { getAppointementHistory, getIncomingAppointement, postAppoitement } from "./function.js";

dotenv.config()

const router = express.Router()

router.get("/appointements/:users_id", async (req, res) => {
    try {
        const p = await getIncomingAppointement(req.params)
        console.log('pppppp',p)
        res.status(200).send({data : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.get("/appointementsHistory/:users_id", async (req, res) => {
    try {
        const p = await getAppointementHistory(req.params)
        console.log('pppppp',p)
        res.status(200).send({data : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.post("/appointements", async (req,res) => {
    try {
        const p = await postAppoitement(req.body)
        console.log('pppppp', p)
        res.status(200).send('rendez-vous posté !')
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

export default router;