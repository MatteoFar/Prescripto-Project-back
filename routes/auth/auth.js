import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { poolPromise } from "../../config/db.js";
import authentificationValidation from "./validators.js"
import { addUserOrDoctor, authenticateDoctor, authenticateUser } from "./functions.js"

dotenv.config()

const router = express.Router()

const errorType = "API" // put on file 
const messageErrorsDatabases = "Something went wrong"

// login
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

// login doctor
router.post("/loginDoctor",authentificationValidation, async (req, res) => {
    try {
        let token = await authenticateDoctor(req.body)
        res.status(200).send({type:'success', message:"docteur connecté avec succée !", token})
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
        // do component for error
        if(!error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
        }
    }
})

// post user
router.post("/postUsers", authentificationValidation, async (req, res) => {
    try {
        await addUserOrDoctor(req.body)
        res.status(200).send({type:'success', message:"utilisateur ajouté avec succée !"})
    } catch (error) {
        res.status(500).send({type: errorType, message: error})
    }
})

// signup doctor
router.post("/postDoctor", authentificationValidation, async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({type: error.status, message: error.message})
        // do component for error
        if(!error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
        }
    }
})

export default router;