import mysql from "mysql"
import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { poolPromise } from "../../config/db.js";
import authentificationValidation from "./validators.js"
import { addUser } from "./functions.js"

dotenv.config()

const router = express.Router()

const errorType = "database"
const messageErrorsDatabases = "Erreur with database"

// router.post("/login",authentificationValidation, login, async (req, res) => {
//     try {
//         res.status(200).send({type:'success', message:"utilisateur ajouté avec succée !"})
//     } catch (error) {
//         res.status(500).send({type: errorType, message: messageErrorsDatabases})
//         throw error
//     }
// })

router.post("/postUsers", authentificationValidation, async (req, res) => {
    try {
        await addUser(req.body)
        res.status(200).send({type:'success', message:"utilisateur ajouté avec succée !"})
    } catch (error) {
        res.status(500).send({type: errorType, message: error})
    }
})

// router.post("/postDoctor", postDoctor)



function login(req, res) {
    console.log("test",req.body)
    let { email, password } = req.body
    let query = `SELECT email, password, id from users where email = '${email}'`

    poolPromise.query(query, function (error, results) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        if(results.find((e) => e.email === email) === undefined) {
            res.status(400).send({type:'error', message:"compte n'existe pas !"})
        } else {
            const passwordOnDatabase = results[0].password
            bcrypt.compare(password, passwordOnDatabase).then((isValid) => {
                if(isValid) {
                    const token = jwt.sign(
                        {
                            user_id : results[0].id 
                        },
                        process.env.JWT_SECRET_TOKEN
                    )
                    return res.status(200).send({type:'success', message:"connection autorisée !", token})
                } 
                res.status(400).send({type:'error', message:"mot de passe incorrect !"})
            })
        }
    })
}

// async function postUsers(req, res) {
//     let { name, firstname, email, phone, password } = req.body
//     console.log(email, password)
//     let query = `SELECT email from users where email = '${email}'`

//     await poolPromise.query(query, function (error, results) {
//         if(error) {
//             res.status(500).send({type: errorType, message: messageErrorsDatabases})
//             throw error
//         }
//         if(results.find((e) => e.email === email) !== undefined) {
//             res.status(400).send({type:'error', message:"compte déjà existant !"})
//         } else {
//             bcrypt.hash(password, 10).then((passwordHased) => passwordHased).then(async(newUserPassword) => {
                

//                 await poolPromise.query(query, function (error, results) {
//                 })
//             })
//         }
//     })   
// }

// signup doctor
function postDoctor(req, res) {
    console.log('test')
}

// login doctor


export default router;