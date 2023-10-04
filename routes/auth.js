import mysql from "mysql"
import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import moment from "moment"
import bcrypt from "bcrypt"

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

router.post("/login", login)
router.post("/postUsers", postUsers)

const errorType = "database"
const messageErrorsDatabases = "Erreur with database"

function login(req, res) {
    console.log("test",req.body)
    let { pseudo, password } = req.body
    connection.query(`SELECT pseudo, password, id from users where pseudo = '${pseudo}'`, function (error, results) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        if(results.find((e) => e.pseudo === pseudo) === undefined) {
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

function postUsers(req, res) {
    let { pseudo, password } = req.body
    console.log(pseudo, password)
    connection.query(`SELECT pseudo from users where pseudo = '${pseudo}'`, function (error, results) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        if(results.find((e) => e.pseudo === pseudo) !== undefined) {
            res.status(400).send({type:'error', message:"compte déjà existant !"})
        } else {
            bcrypt.hash(password, 10).then((passwordHased) => passwordHased).then((newUserPassword) => {
                connection.query(`INSERT into users (pseudo, password, date) values ('${pseudo}', '${newUserPassword}', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`, function (error, results) {
                    if(error) {
                        res.status(500).send({type: errorType, message: messageErrorsDatabases})
                        throw error
                    }
                    res.status(200).send({type:'success', message:"utilisateur ajouté avec succée !"})
                    console.log(results)
                })
            })
        }
    })
    
}

// login doctor
// signup doctor

export default router;