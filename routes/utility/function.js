import { poolPromise } from "../../config/db.js";
import bcrypt from "bcrypt"

// function for if account password is correct
export async function checkPassword(userType, id, password) {
    try {
        const query = `SELECT * from ${userType} where Id_${userType === 'doctor' ? 'Doctor' : 'Users'} = ?`
        
        const result = await poolPromise.query(query, [id]);

        console.log(result[0])
        
        const hashComparePasswordDoctor = await bcrypt.compare(password, result[0][0].password)

        console.log('TEST',hashComparePasswordDoctor)
        return hashComparePasswordDoctor ? true  : false
    } catch (error) {
        console.error('err', error)
        throw error
    }
}