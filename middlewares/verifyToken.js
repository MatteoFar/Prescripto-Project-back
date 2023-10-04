import dotenv from "dotenv"
import jwt from "jsonwebtoken"


dotenv.config()

export default function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({type:"error", message:"Access denied! you must be authentificated"})
    }
    const token = req.headers.authorization.split(" ")[1]
    console.log('1')
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        console.log('MIDDLEWARE',req.body)
        req.body.user_id = decodedToken.user_id
        next()
    } catch (error) {
        console.log('2')
        return res.status(403).send({tyoe:"error", message:"Access denied! Invalid token !"})
    }
}
