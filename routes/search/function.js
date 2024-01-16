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
        // récupérer les horaires ici
        // en faire un tableau de date basé sur les 2 prochaines semaines (essayer un tableau de tableaux)
        // checker dans la table /getStandyByAppointement
        let query = "Select doctor.name as doctor_name, doctor.firstname, doctor.email, doctor.phone, doctor.medical_domain, office.adresse, office.town, office.postal_code, office.schedule_morning, office.schedule_afternoon from doctor inner join office on doctor.Id_office = office.Id_office where doctor.medical_domain = ? and office.town = ? and office.postal_code = ?;"
        let {type, postal_code, town} = data
        
        const result = await poolPromise.query(query, [type, town, postal_code]);

        return result[0]
        
    } catch (error) {
        console.error(error)
        throw error
    }
}