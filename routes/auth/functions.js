import bcrypt from "bcrypt"
import { poolPromise } from "../../config/db.js";
import moment from "moment";

export async function addUser(user) {
    try {
        if (user.email === null || user.password === null) {
            //If they are null then throw object with status 400 and message that fields missing
            throw { status: "400", message: "Missing fields" };
          }
    
          let check_user = await getByEmail(user.email);
    
          if (check_user.length !== 0) {
            //If a user with the same pseudo exist then throw error with status 400 and message that account already exists
            throw { status: "400", message: "Account already exists" };
          }
    
          user.password = await bcrypt.hash(user.password, 10);
    
          await add(user);
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getByEmail(email) {
    let query = "SELECT email from users where email=?";
    const result = await poolPromise.query(query, [email]);
    return result[0];
  }

export async function add(data) {
    try {
        let { name, firstname, email, phone, password } = data
        console.log(data.password)
        let query = 'INSERT into users (name, firstname, email, phone, password, date) values (?, ?, ?, ?, ?, ?)'
        const result = await poolPromise.query(query, [name, firstname, email, phone, password, moment().format('YYYY-MM-DD HH:mm:ss')]);
      
        return result;
    } catch (error) {
        console.log(error)
        throw error
    }
}