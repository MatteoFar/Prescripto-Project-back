const mysql = require("mysql")
const dotenv = require("dotenv")
const express = require("express")
const cors = require("cors")

dotenv.config()

const app = express()

const auth = require("./routes/auth.js")
const data = require("./routes/data")


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

module.exports = connection;