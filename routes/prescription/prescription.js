import mysql from "mysql"
import dotenv from "dotenv"
import express from "express"
import moment from "moment"

import verifyToken from "../../middlewares/verifyToken.js"
import { deletePrescriptionDrug, getIncomingPrescriptionDrugUptake, getPrescriptionDrugUptake, postPrescription, putPrescriptionDrugUptake } from "./functions.js"

dotenv.config()

const router = express.Router()

const connection = mysql.createConnection({ // mettre dans un fichier appart
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'mypillbox'
})

connection.connect((error)=>{
    if(error) throw error;
});

const errorType = "database"
const messageErrorsDatabases = "Erreur with database"

// Doctor
// post postPrescriptionDrug and postPrescriptionDrug_uptake
router.post("/postPrescriptionDrug", verifyToken, async (req, res) => {
    try {
        const p = await postPrescription(req.body)
        console.log('pppppp',p)
        res.status(200).send("Médicament et la prise ont été ajoutés dans l'ordonnance avec succée !")
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.get("/getPrescriptionDrugUptake/:user_id", verifyToken, async (req, res) => {
    try {
        const p = await getPrescriptionDrugUptake(req.params)
        console.log('pppppp',p)
        res.status(200).send({data : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

//incoming PrescriptionDrugUptake
router.get("/getIncomingPrescriptionDrugUptake/:user_id", verifyToken, async (req, res) => {
    try {
        const p = await getIncomingPrescriptionDrugUptake(req.params)
        console.log('pppppp',p)
        res.status(200).send({data : p})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})
// validate PrescriptionDrugUptake
router.put("/putPrescriptionDrugUptake", verifyToken, async (req, res) => {
    try {
        const p = await putPrescriptionDrugUptake(req.body)
        console.log('pppppp',p)
        res.status(200).send("Prise de médicaments enregistrée avec succée !")
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})
// delete prescriptionDrug 
router.delete("/deletePrescriptionDrug", verifyToken, async (req, res) => {
    try {
        const p = await deletePrescriptionDrug(req.body)
        console.log('pppppp',p)
        res.status(200).send("Médicament supprimé de l'ordonnance avec succée !")
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
    }
})

router.put("/putPrescriptionDrug", verifyToken, putPrescriptionDrug)

function putPrescriptionDrug(req, res) {
    const { tablet, time, id } = req.body
    connection.query(`UPDATE prescription_drug SET tablet = ${tablet}, time = '[${time.map((t) => `"${t}"`)}]' WHERE id = ${id}`, function (error,) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        res.status(200).send({type:"success", message: "prescriptionDrug updated with success"})
        // connection.query(`UPDATE prescription_drug_uptake SET date = '', tablet = '' `, function (errors, results) {
        //     if(errors) {
        //         res.status(500).send({type: errorType, message: messageErrorsDatabases})
        //         throw error
        //     }
        // })

        // finir ICI
    })
    // put uptake
}

export default router;