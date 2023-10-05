import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: ".env"});

const pool = mysql.createPool({
  connectionLimit: 151,
  password: process.env.DB_PASSWORD,
  user: "root",
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  timezone: "+00:00",
});

export const poolPromise = pool.promise();

export default pool;
