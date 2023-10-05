import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { poolPromise } from "../../config/db.js";
import authentificationValidation from "./validators.js"
import { addUser, authenticateUser } from "./functions.js"

dotenv.config()

const router = express.Router()

const errorType = "API"
const messageErrorsDatabases = "Something went wrong"

router.post("/login",authentificationValidation, async (req, res) => {
    try {
        console.log(req.body)
        let token = await authenticateUser(req.body)
        res.status(200).send({type:'success', message:"utilisateur connecté avec succée !", token})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
        // do component for error
        if(!error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
        }
    }
})

router.post("/postUsers", authentificationValidation, async (req, res) => {
    try {
        await addUser(req.body)
        res.status(200).send({type:'success', message:"utilisateur ajouté avec succée !"})
    } catch (error) {
        res.status(500).send({type: errorType, message: error})
    }
})

// router.post("/postDoctor", postDoctor)

// signup doctor
function postDoctor(req, res) {
    console.log('test')
}

// login doctor


export default router;