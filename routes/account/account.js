import dotenv from "dotenv"
import express from "express"

import { deleteAccount, getDoctorInfo, getUserInfo, putDoctorInfo, putDoctorPassword, putUserInfo, putUserPassword } from "./function.js";
import verifyToken from "../../middlewares/verifyToken.js";

dotenv.config()

const router = express.Router()

// Users account
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

router.put("/:users_id", async(req, res) => {
    try {
        const p = await putUserInfo(req.body, req.params)
        console.log('pppppp', p)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})

router.put("/changePassword/:users_id", async(req, res) => {
    try {
        const p = await putUserPassword(req.body, req.params)
        console.log('pppppp', p)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})

router.delete("/deleteAccount", verifyToken, async( req, res ) => {
    try {
        await deleteAccount(req.body)
        res.status(200).send({message : 'Compte supprimé avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})

// Doctor account
router.get("/doctor/:doctor_id", async(req, res) => {
    try {
        const p = await getDoctorInfo(req.params)
        res.status(200).send({data : p})
    } catch (error) {
        console.error("err", error)
        throw error
    }
})

router.put("/doctor/:doctor_id", async(req, res) => {
    try {
        await putDoctorInfo(req.body, req.params)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})

router.put("/doctor/changePassword/:doctor_id", async(req, res) => {
    try {
        await putDoctorPassword(req.body, req.params)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})


export default router;