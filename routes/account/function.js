import { poolPromise } from "../../config/db.js";
import bcrypt from "bcrypt"
import { checkPassword } from "../utility/function.js";
import jwt from "jsonwebtoken"

// GET routes INFO
export async function getUserInfo(data) {
    try {
        const {users_id} = data
        console.log('users_id',users_id)
        const query = 'SELECT * from users where Id_Users = ?'
        const result = await poolPromise.query(query, [users_id]);

        return result[0]
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

export async function getDoctorInfo(data) {
    try {
        const {doctor_id} = data
        console.log('doctor_id',doctor_id)
        const query = 'SELECT * from doctor where Id_Doctor = ?'
        const result = await poolPromise.query(query, [doctor_id]);

        return result[0]
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

// PUT routes INFO
export async function putDoctorInfo(data, dataParams) {
    try {
        const {medical_domain, name, firstname, email, phone, presentation, diplomas, price_average, accept_vital_card, new_patient, spoken_languages, Id_office} = data
        const query = 'UPDATE doctor SET medical_domain=?, name=?, firstname=?, email=?, phone=?, presentation=?, diplomas=?, price_average=?, accept_vital_card=?, new_patient=?, spoken_languages=?, Id_office=? where Id_Doctor= ?'

        const result = await poolPromise.query(query, [medical_domain, name, firstname, email, phone, presentation, diplomas, price_average, accept_vital_card, new_patient, spoken_languages, Id_office, dataParams.doctor_id]);
        return result[0]
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

export async function putUserInfo(data, dataParams) {
    try {
        const {name, firstname, email, phone} = data
        const query = 'UPDATE users SET name=?, firstname=?, email=?, phone=? where Id_Users= ?'

        const result = await poolPromise.query(query, [name, firstname, email, phone, dataParams.users_id]);

        return result[0]
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

// PUT routes Password
export async function putDoctorPassword(data, dataParams) {
    try {
        const {password, newPassword, confirmNewPassword} = data
        const query = 'UPDATE doctor SET password=? where Id_Doctor= ?'
        const checkPasswordDoctor = await checkPassword("doctor", dataParams.doctor_id, password)

        if(checkPasswordDoctor && newPassword === confirmNewPassword) {
            const passwordHashed = await bcrypt.hash(newPassword, 10);
    
            const result = await poolPromise.query(query, [passwordHashed, dataParams.doctor_id]);
            return result[0]
        }
        throw { status: "401", message: "Invalid Credentials" }; // trouver une alternative
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

export async function putUserPassword(data, dataParams) {
    try {
        const {password, newPassword, confirmNewPassword} = data
        const query = 'UPDATE users SET password=? where Id_Users= ?'
        const checkPasswordUser = await checkPassword("users", dataParams.users_id, password)

        if(checkPasswordUser && newPassword === confirmNewPassword) {
            const passwordHashed = await bcrypt.hash(newPassword, 10);
    
            const result = await poolPromise.query(query, [passwordHashed, dataParams.users_id]);
            return result[0]
        }
        throw { status: "401", message: "Invalid Credentials" }; // trouver une alternative
    } catch (error) {
        console.error('err', error)
        throw error
    }
}

// Delete Account

export async function deleteAccount(data) {
    try {
        let firstPropertyName;
        for (let propertyName in data.id) {
            firstPropertyName = propertyName;
            break;
        }
          
        if(firstPropertyName === 'userId') {
            const id = data.id
            const query = 'DELETE FROM users WHERE Id_Users=?;'
            await poolPromise.query(query, [id.userId]);
        } else {
            const id = data.id
            const query = 'DELETE FROM doctor WHERE Id_Doctor=?;'
            await poolPromise.query(query, [id.doctorId]);
        }
    } catch (error) {
        console.error('err', error)
        throw error
    }
}