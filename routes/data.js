const express = require("express")
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const moment = require("moment")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const verifyToken = require("../middlewares/verifyToken.js")

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

router.post("/prescriptionDrug", verifyToken, postPrescription)
router.get("/getPrescriptionDrug", verifyToken, getPrescriptionDrug)
router.put("/putPrescriptionDrug", verifyToken, putPrescriptionDrug)
router.delete("/deletePrescriptionDrug", verifyToken, deletePrescriptionDrug)

router.post("/postPrescriptionDrugUptake", verifyToken, postPrescriptionDrugUptake)
router.get("/getPrescriptionDrugUptake", verifyToken, getPrescriptionDrugUptake)
router.delete("/deletePrescriptionDrugUptake", verifyToken, deletePrescriptionDrugUptake)

const errorType = "database"
const messageErrorsDatabases = "Erreur with database"

function postPrescription(req, res) {
    const { user_id, drug_name, quantity_mg, time, tablets } = req.body
    connection.query(`INSERT INTO prescription_drug (user_id,drug_name, quantity_mg, tablet, time) VALUES ('${user_id}','${drug_name}', '${quantity_mg}', '${tablets}', '[${time.map((e) => `"${e}"`)}]')`, function(error) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        time.map((e) => {
        let time = e.split(":")
        const t = moment().set('hours', time[0]).set('minutes', time[1]).set('second', 0).format('YYYY-MM-DD HH:mm:ss')

        connection.query(`INSERT INTO prescription_drug_uptake (user_id, drug_name, quantity_mg, tablet, date, validation) VALUES ('${user_id}','${drug_name}', '${quantity_mg}', '${tablets}', '${t}', '0')`, function(error) {
                if(error) {
                    res.status(500).send({type: errorType, message: messageErrorsDatabases})
                    throw error
                }
            })
        })
        res.status(200).send({type: "success", message:"prescription_drug added with success !"})
    })
}

function getPrescriptionDrug(req, res) {
    const {user_id} = req.body
    connection.query(`SELECT * from prescription_drug where user_id=${user_id}`, function(error, results) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        res.status(200).send({type:"success", results})
    })
}

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

function deletePrescriptionDrug(req, res) {
    const { payload } = req.body

    connection.query(`DELETE FROM prescription_drug WHERE id = ${payload.data.id.id}`, function (error) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        res.status(200).send({type:"success", message: "prescriptionDrug delete with success"})
    })

    // delete uptake here
}

// drug_uptake

function postPrescriptionDrugUptake(req, res) {
    const { user_id, date } = req.body
    console.log(req.body)

    connection.query(`Select * from verificationuptake where user_id = ${user_id}`, function(error, results) {
        if(error) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw error
        }
        // add Date and user_id for new users
        if(results.length === 0) {
            connection.query(`INSERT INTO verificationuptake (user_id, using_date) VALUES ('${user_id}','${moment(new Date()).format("YYYY-MM-DD")}')`, function(error, results) {
                if(error) {
                    res.status(500).send({type: errorType, message: messageErrorsDatabases})
                    throw error
                }
            })
        }
        //update Date
        if(moment(results[0].using_date).format("YYYY-MM-DD") !== moment(date).format("YYYY-MM-DD")) {
            connection.query(`UPDATE verificationuptake SET using_date = '${moment(date).format("YYYY-MM-DD")}' where user_id = ${user_id}`, function (error, results) {
                if(error) {
                    res.status(500).send({type: errorType, message: messageErrorsDatabases})
                    throw error
                }
                //post prescription_drug_uptake here
                console.log('verificationDate updated with success !')
                connection.query(`SELECT * from prescription_drug WHERE user_id =${user_id}`, function (errors, results) {
                    if(errors) {
                        res.status(500).send({type: errorType, message: messageErrorsDatabases})
                        throw errors
                    }
                    if(results) {
                        const { drug_name, quantity_mg, tablet, time } = results[0]
                        const arrayTime = JSON.parse(time)
                        arrayTime.map((e) => {
                            let y = e.split(':')
                            let timeFormatted = moment().set('hour', y[0]).set('minutes', y[1]).set('second',0).format("YYYY-MM-DD HH:mm:ss")
                            connection.query(`INSERT INTO prescription_drug_uptake (date, user_id, drug_name, quantity_mg, tablet, validation) VALUES('${timeFormatted}','${user_id}', '${drug_name}', '${quantity_mg}', '${tablet}', '0')`, function (errors, results) {
                                if(errors) {
                                    res.status(500).send({type: errorType, message: messageErrorsDatabases})
                                    throw errors
                                }
                                console.log('prescription_drug_uptake added with success')
        
                            })
                        })
                    }
                })
                
            })
        }
    })

    // connection.query(`INSERT INTO verificationuptake (user_id, using_date) VALUES ''`)

    // mettre la date du jour dans la table verificationuptake avec le user_id
    // si la date du envoyée est différante de la date inscrit dans la table lancer la requete qui va ajouter les dates du jours
}

function getPrescriptionDrugUptake(req, res) {
    const { user_id } = req.body
    connection.query(`SELECT * from prescription_drug_uptake where user_id = ${user_id}`,function (errors, results) {
        if(errors) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw errors
        }
        res.status(200).send({type:"success", results})
    })
}

function deletePrescriptionDrugUptake(req,res) {
    const { payload } = req.body
    connection.query(`DELETE from prescription_drug_uptake where id = '${payload.id}'`,function (errors, results) {
        if(errors) {
            res.status(500).send({type: errorType, message: messageErrorsDatabases})
            throw errors
        }
        res.status(200).send({type:"success", message: "prescriptionDrug delete with success"})
    })
}





module.exports = router