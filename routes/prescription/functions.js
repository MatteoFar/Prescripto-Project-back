import { poolPromise } from "../../config/db.js";
import _ from "lodash";
import isEmpty from "lodash";
import moment from "moment";

export async function getPrescriptionByDoctor(Id_Users, id) {
    try {
        console.log(Id_Users, id)
        const query = `Select * from prescription_drug where Id_Doctor=? and Id_Users=?`
        const result = await poolPromise.query(query, [id.doctorId, Id_Users]);

        console.log('AAAAA',result[0])

        return result[0]
    } catch (error) {
        
    }
}

export async function postPrescription(data) {
    try {
        const { drug_name, quantity_mg, tablet, Id_Users, time, id } = data

        //add Patient_Monitoring
        const hasDrugByDoctor = await getPrescriptionByDoctor(Id_Users, id)
        console.log(_.isEmpty(hasDrugByDoctor))
        
        if(_.isEmpty(hasDrugByDoctor)) {
            // add Patient_Monitoring
            console.log('OUI')
        } else {
            // don't add Patient_Monitoring
            console.log('NON')
        }

        // add drug to prescription
        const query = `INSERT INTO prescription_drug (drug_name, quantity_mg, created_at, tablet, Id_Doctor, Id_Users, time) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const formatTimeStringToArray = JSON.parse(time.replace(/(\d{1,2}:\d{2})/g, '"$1"')) // à retravailler avec le front-end
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        const t = formatTimeStringToArray.map((e) => `"${e}"`)
        const result = await poolPromise.query(query, [drug_name, quantity_mg, dateTimeToday, tablet, id.doctorId, Id_Users, `[${[t]}]`]);

        return result[0]
        // add drug to prescription_uptake
        // connection.query(`INSERT INTO prescription_drug (user_id,drug_name, quantity_mg, tablet, time) VALUES ('${user_id}','${drug_name}', '${quantity_mg}', '${tablets}', '[${time.map((e) => `"${e}"`)}]')`, function(error) {
        //     if(error) {
        //         res.status(500).send({type: errorType, message: messageErrorsDatabases})
        //         throw error
        //     }
        //     time.map((e) => {
        //     let time = e.split(":")
        //     const t = moment().set('hours', time[0]).set('minutes', time[1]).set('second', 0).format('YYYY-MM-DD HH:mm:ss')

        //     connection.query(`INSERT INTO prescription_drug_uptake (user_id, drug_name, quantity_mg, tablet, date, validation) VALUES ('${user_id}','${drug_name}', '${quantity_mg}', '${tablets}', '${t}', '0')`, function(error) {
        //             if(error) {
        //                 res.status(500).send({type: errorType, message: messageErrorsDatabases})
        //                 throw error
        //             }
        //         })
        //     })
        //     res.status(200).send({type: "success", message:"prescription_drug added with success !"})
        // })
    } catch (error) {
        console.error('err',error)
        throw error
    }

}