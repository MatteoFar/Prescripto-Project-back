import { poolPromise } from "../../config/db.js";
import moment from "moment";


export async function getUserInfo(data) {
    try {
        const {users_id} = data
        console.log(users_id)
        const query = 'SELECT * from users where Id_Users = ?'
        const result = await poolPromise.query(query, [users_id]);

        return result[0]
    } catch (error) {
        console.error('err', error)
        throw error
    }
}