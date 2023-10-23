import { poolPromise } from "../../config/db.js";
import bcrypt from "bcrypt"
import moment from "moment";


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

export async function putUserInfo(data, dataParams) {
    try {
        const {name, firstname, email, phone, password, confirmPassword, newPassword} = data
        const query = 'UPDATE users SET name=?, firstname=?, email=?, phone=?, password=? where Id_Users= ?'

        const passwordUser = await getUserInfo(dataParams)

        const hashComparePasswordUser = await bcrypt.compare(password, passwordUser[0].password)

        if(hashComparePasswordUser && password === confirmPassword) {
            const passwordHashed = await bcrypt.hash(newPassword, 10);
    
            const result = await poolPromise.query(query, [name, firstname, email, phone, passwordHashed, dataParams.users_id]);
            return result[0]
        }
        throw { status: "401", message: "Invalid Credentials" };
    } catch (error) {
        console.error('err', error)
        throw error
    }
}