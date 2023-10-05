import mysql from "mysql"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"

dotenv.config()

const app = express()

import auth from "./routes/auth.js"
import data from "./routes/data.js"

//cron
import "./cron/sync_prescription_uptake.js"


const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.use("/auth", auth)
app.use("/data", data)

const connection = mysql.createConnection({ // mettre dans un fichier appart
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'mypillbox'
})

connection.connect((error)=>{
    if(error) throw error;
    console.log("Successfully connected with Database");
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ! ${PORT}`);
   });

export default connection;