import moment from "moment";
import { poolPromise } from "../../config/db.js";
import _ from "lodash";

export async function getSymptom(Id_Users) {
    try {
        console.log(Id_Users)
        const query = `Select * from symptoms where Id_Users=?`
        const result = await poolPromise.query(query, [Id_Users.user_id]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function postSymptom(data) {
    try {
        const {symptom_name, date_symptom, intensity, note, id } = data
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const query = `INSERT INTO symptoms (symptom_name, date_symptom, intensity, note, created_at, Id_Users) VALUES (?, ?, ?, ?, ?, ?)`
        const result = await poolPromise.query(query, [symptom_name, date_symptom, intensity, note, dateTimeToday, id.userId]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}