import bcrypt from "bcrypt"
import { poolPromise } from "../../config/db.js";
import jwt from "jsonwebtoken"
import moment from "moment";

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
        let query = 'SELECT * from appointement where Id_Users=?'

        let {users_id} = data

        const result = await poolPromise.query(query, [users_id]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

