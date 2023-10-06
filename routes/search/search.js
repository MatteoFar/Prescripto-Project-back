import dotenv from "dotenv"
import express from "express"

import { poolPromise } from "../../config/db.js";
import { searchDoctor } from "./function.js";

dotenv.config()

const router = express.Router()

router.get("/:type/:postal_code/:town", async (req, res) => {
    try {
        const p = await searchDoctor(req.params)
        console.log('PPPPP',p)
        res.status(200).send({data : p})
    } catch (error) {
        console.error(error)
    }
})

export default router;