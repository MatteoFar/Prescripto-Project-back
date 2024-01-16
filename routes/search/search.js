import dotenv from "dotenv"
import express from "express"

import { searchDoctor } from "./function.js";

dotenv.config()

const router = express.Router()

router.get("/:type/:postal_code/:town", async (req, res) => {
    try {
        const p = await searchDoctor(req.params)
        res.status(200).send({result : p})
    } catch (error) {
        console.error(error)
    }
})

export default router;