import bcrypt from "bcrypt"
import { poolPromise } from "../../config/db.js";
import jwt from "jsonwebtoken"
import moment from "moment";

export async function searchDoctor(serchData) {
    const d = await getDoctorBySearch(serchData)
    return d
}

export async function getDoctorBySearch(data) {
    try {
        let query = "Select doctor.name as doctor_name, doctor.firstname, doctor.email, doctor.phone, doctor.medical_domain, office.town, office.postal_code from doctor inner join office on doctor.Id_office = office.Id_office where doctor.medical_domain = ? and office.town = ? and office.postal_code = ?;"
        let {type, postal_code, town} = data
        
        const result = await poolPromise.query(query, [type, town, postal_code]);

        return result[0]
        
    } catch (error) {
        console.error(error)
        throw error
    }
}