import dotenv from "dotenv"
import express from "express"

import { getDoctorInfo, getUserInfo, putDoctorInfo, putDoctorPassword, putUserInfo, putUserPassword } from "./function.js";

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
        const p = await putDoctorInfo(req.body, req.params)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})

router.put("/doctor/changePassword/:doctor_id", async(req, res) => {
    try {
        const p = await putDoctorPassword(req.body, req.params)
        res.status(200).send({message : 'Informations mis à jour avec succée !'})
    } catch (error) {
        res.status(500).send(error)
        console.error("err", error)
        throw error
    }
})


export default router;