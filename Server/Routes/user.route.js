import express from "express"
import {isAuth} from "../Middlewares/isAuth.js"
import {getCurrentUser, saveAssistant} from "../Controllers/user.controller.js"
export const userRouter = express.Router()
   
userRouter.get("/current-user" , isAuth , getCurrentUser)
   
userRouter.post("/save-assistant" , isAuth , saveAssistant)


export default userRouter


   