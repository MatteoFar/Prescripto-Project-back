import dotenv from "dotenv"
import express from "express"

import { getSymptom, postSymptom } from "./function.js";
import verifyToken from "../../middlewares/verifyToken.js";

dotenv.config()

const router = express.Router()

// get symptoms
router.get("/getSymptom/:user_id", verifyToken, async (req, res) => {
    try {
        const p = await getSymptom(req.params)
        console.log('PPPPP',p)
        res.status(200).send({data : p})
    } catch (error) {
        console.error(error)
    }
})

//post symptom (for users)
router.post("/postSymptom", verifyToken, async (req, res) => {
    try {
        const p = await postSymptom(req.body)
        console.log('PPPPP',p)
        res.status(200).send('Symptome enregistré avec succée !')
    } catch (error) {
        console.error(error)
    }
})

export default router;