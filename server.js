import mysql from "mysql"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

dotenv.config()

const app = express()

import auth from "./routes/auth/auth.js"
import prescription from "./routes/prescription/prescription.js"
import search from "./routes/search/search.js"
import appointement from "./routes/appointement/appointement.js"
import account from "./routes/account/account.js"
import symptom from "./routes/symptom/symptom.js"

//cron
import "./cron/sync_prescription_uptake.js"


const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", auth)
app.use("/prescription", prescription)
app.use("/search", search)
app.use("/appointement", appointement)
app.use("/account", account)
app.use("/symptom", symptom)

const connection = mysql.createConnection({ // mettre dans un fichier appart
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

connection.connect((error)=>{
    if(error) throw error;
    console.log("Successfully connected with Database");
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ! ${PORT}`);
   });

export default connection;