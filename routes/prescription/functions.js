import { poolPromise } from "../../config/db.js";
import _ from "lodash";
import moment from "moment";

export async function getPrescription(Id_Users, id) {
    try {
        console.log(Id_Users, id)
        const query = `Select * from prescription_drug where Id_Users=?`
        const result = await poolPromise.query(query, [Id_Users]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function getPrescriptionByDoctor(Id_Users, id) {
    try {
        console.log(Id_Users, id)
        const query = `Select * from prescription_drug where Id_Doctor=? and Id_Users=?`
        const result = await poolPromise.query(query, [id.doctorId, Id_Users]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}


export async function getPrescriptionDrugUptake(params) {
    try {
        const query = `Select * from prescription_drug_uptake where Id_Users=?`
        const result = await poolPromise.query(query, [params.user_id]);

        return result[0]
    } catch (error) {
        
    }
}

export async function getIncomingPrescriptionDrugUptake(params) {
    try {
        const query = `Select * from prescription_drug_uptake where Id_Users=? and validation=0`
        const result = await poolPromise.query(query, [params.user_id]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}


export async function postPatient_monitoring(Id_Users, id) {
    try {
        console.log(Id_Users, id)
        let query = 'INSERT INTO patient_monitoring (Id_Users, Id_Doctor) VALUES (?,?)'
        const result = await poolPromise.query(query, [Id_Users, id.doctorId]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function postDrugToPrescription(data) {
    try {
        const { drug_name, quantity_mg, tablet, Id_Users, time, dateEndTreatement, id } = data
        const query = `INSERT INTO prescription_drug (drug_name, quantity_mg, created_at, tablet, Id_Doctor, Id_Users, time, date_end_treatement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        const formatTimeStringToArray = JSON.parse(time.replace(/(\d{1,2}:\d{2})/g, '"$1"')) // à retravailler avec le front-end
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        const t = formatTimeStringToArray.map((e) => `"${e}"`)
        const result = await poolPromise.query(query, [drug_name, quantity_mg, dateTimeToday, tablet, id.doctorId, Id_Users, `[${[t]}]`, dateEndTreatement]);

        postDrugToPrescriptionUptake(data, formatTimeStringToArray, result[0].insertId) // add drug to prescription_uptake

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function postDrugToPrescriptionUptake(data, time, Id_Prescription_drug) {
    try {
        const { drug_name, quantity_mg, tablet, Id_Users } = data
        const query = `INSERT INTO prescription_drug_uptake (validation, drug_name, quantity_mg, tablet, date_uptake, created_at, Id_Prescription_drug, Id_Users) VALUES (0, ?, ?, ?, ?, ?, ?, ?)`
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        time.map(async(t) => {
            let time = t.split(":")
            const timeFormat = moment().set('hours', time[0]).set('minutes', time[1]).set('second', 0).format('YYYY-MM-DD HH:mm:ss')
            console.log('timeFormat',new Date(timeFormat))
            if(new Date(timeFormat) > new Date()) {
                await poolPromise.query(query, [drug_name, quantity_mg, tablet, timeFormat, dateTimeToday, Id_Prescription_drug ,Id_Users]);
            }
        })
    } catch (error) {
        console.error('err',error)
        throw error
    }
}



export async function postPrescription(data) {
    try {
        const { Id_Users, id } = data

        //add Patient_Monitoring
        const hasDrugByDoctor = await getPrescriptionByDoctor(Id_Users, id)
        if(_.isEmpty(hasDrugByDoctor)) {
            postPatient_monitoring(Id_Users,id)
        }

        // add drug to prescription and add to prescription_uptake
        postDrugToPrescription(data)
    } catch (error) {
        console.error('err',error)
        throw error
    }

}

export async function putPrescriptionDrugUptake(data) {
    try {
        const {Id_Prescription_drug_uptake, id} = data
        let query = 'UPDATE prescription_drug_uptake SET validation=1 where Id_Prescription_drug_uptake= ? and Id_Users= ?'
        const result = await poolPromise.query(query, [Id_Prescription_drug_uptake,id.userId]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}