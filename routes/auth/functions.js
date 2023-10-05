import bcrypt from "bcrypt"
import { poolPromise } from "../../config/db.js";
import jwt from "jsonwebtoken"
import moment from "moment";

export async function authenticateUser(user) {
    try {
    //Check in database if a user with this email exists
    let check_user = await getByEmail(user.email);
  
    // If the email doesn't exist in the database, throw an error with "Invalid Credentials" message
    if (check_user.length === 0) {
      throw { status: "401", message: "Invalid Credentials" };
    }

    const hashCompare = await bcrypt.compare(user.password, check_user[0].password)
  
    // Compare the password provided by the user with the hashed password stored in the database
    if (!hashCompare) {
      throw { status: "401", message: "Invalid Credentials" };
    }

    console.log(check_user)
  
    //Generate an authentification token for the new user
    let token = jwt.sign({ userId: check_user[0].Id_Users }, process.env.JWT_SECRET_TOKEN);
  
    //Return the authentification token
    return token;

    } catch (error) {
        console.error('err',error)
        throw error
    }
  }

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
    let query = "SELECT * from users where email=?";
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