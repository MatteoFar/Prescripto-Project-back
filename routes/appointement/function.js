import bcrypt from "bcrypt"
import { poolPromise } from "../../config/db.js";
import jwt from "jsonwebtoken"
import moment from "moment";

/// post Appointement
export async function postAppoitement(data) {
    try {
        const dataAppointement = postAppoitementUser(data)
        return dataAppointement
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function postAppoitementUser(data) {
    try {
        const {date_meeting, reason, created_at, Id_office, Id_Doctor, Id_Users} = data
        const query = 'INSERT INTO appointement (date_meeting, validation, reason, created_at, Id_office, Id_Doctor, Id_Users) value (?, 0, ?, ?, ?, ?, ?)'
        const result = await poolPromise.query(query, [date_meeting, reason, created_at, Id_office, Id_Doctor, Id_Users]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

/// get Appointement
export async function getIncomingAppointement(data) {
    try {
        const dataAppointement = getIncomingAppointementUser(data)
        return dataAppointement
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function getIncomingAppointementUser(data) {
    try {
        const query = 'SELECT * from appointement where Id_Users=?'

        const {users_id} = data

        const result = await poolPromise.query(query, [users_id]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

