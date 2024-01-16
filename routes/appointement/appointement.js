import dotenv from "dotenv"
import express from "express"

import { getAppointementHistory, getIncomingAppointement, getStandyByAppointement, postAppoitement, putValidateAppointementDoctor } from "./function.js";
import verifyToken from "../../middlewares/verifyToken.js";

dotenv.config()

const router = express.Router()

router.get("/incomingAppointements", verifyToken, async (req, res) => {
    try {
        const p = await getIncomingAppointement(req.body)
        console.log('IncomingAppoitementPAtientData',p)
        res.status(200).send({result : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.get("/appointementsHistory", verifyToken, async (req, res) => {
    try {
        const p = await getAppointementHistory(req.body)
        console.log('historyAppoitementPAtientData',p)
        res.status(200).send({result : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.post("/postAppointements", verifyToken, async (req,res) => {
    try {
        const p = await postAppoitement(req.body)
        console.log('pppppp', p)
        res.status(200).send('rendez-vous posté !')
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

// APPOINTEMENT DOCTOR

router.get("/getStandyByAppointement", verifyToken, async (req, res) => {
    try {
        const p = await getStandyByAppointement(req.body)
        console.log('pppppp',p)
        res.status(200).send({data : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.put("/putValidateAppointement/:user_id", verifyToken, async (req, res) => {
    try {
        const p = await putValidateAppointementDoctor(req.body, req.params)
        console.log('pppppp',p)
        res.status(200).send('rendez-vous accepté !')
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

export default router;