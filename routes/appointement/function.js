import { poolPromise } from "../../config/db.js";
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

export async function getAppointementHistory(data) {
    try {
        const dataAppointement = getIncomingAppointementHistoryUser(data)
        return dataAppointement
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function getIncomingAppointementHistoryUser(data) {
    try {
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        console.log('dateTimeToday', dateTimeToday)
        const query = 'SELECT * from appointement where Id_Users=? and validation=1 and ? > date_meeting'

        const {userId} = data.id

        const result = await poolPromise.query(query, [userId, dateTimeToday]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function getIncomingAppointementUser(data) {
    try {
        const query = 'SELECT * from appointement where Id_Users=?'

        const {userId} = data.id

        const result = await poolPromise.query(query, [userId]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

// DOCTOR FUNCTIONS
// get appointement
export async function getStandyByAppointement(data) {
    try {
        const dataAppointement = getIncomingAppointementDoctor(data)
        return dataAppointement
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function getIncomingAppointementDoctor(data) {
    try {
        const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const query = 'SELECT * from appointement where Id_Doctor=? and validation=0 and ? < date_meeting'

        const {id} = data

        const result = await poolPromise.query(query, [id.doctorId, dateTimeToday]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

// put appointement
export async function putValidateAppointementDoctor(data, params) {
    try {
        const dataAppointement = await putValidateAppointement(data, params)
        return dataAppointement
    } catch (error) {
        console.error('err',error)
        throw error
    }
}

export async function putValidateAppointement(data, params) {
    try {
        const query = 'UPDATE appointement SET validation=? where Id_Doctor=? and Id_Users=?'

        const {id} = data

        const result = await poolPromise.query(query, [1, id.doctorId, params.user_id]);

        return result[0]
    } catch (error) {
        console.error('err',error)
        throw error
    }
}
