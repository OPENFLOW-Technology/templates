import {getRepository} from "typeorm";

require('dotenv').config()
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthorised.middleware";
import AuthController from "../controller/AuthController";
import { user } from "../entity/user.entity";

require('dotenv').config()
var jwt = require('jsonwebtoken');
const router = express.Router();


router.post("/register", AuthController.createUser);
router.get("/all_user", AuthController.getAllUser);
router.get("/get_by_id/:uid", AuthController.getUser);
router.post("/login", AuthController.login)
router.put("/update_user/:uid", isAuthenticated, AuthController.updateUser)
router.put("/update_logged_in_user", isAuthenticated, AuthController.updateLoginUser);
router.put("/update_password/:uid", isAuthenticated, AuthController.updateUserPassword);
router.put("/update_logged_in_user_password", isAuthenticated, AuthController.updateLoginUserPassword);
router.put("/reset_password", AuthController.resetPassword);
router.post("/forget_password", AuthController.forgetPassword);
router.post("/user/delete/:uid", AuthController.delateUserById);
router.post("/verify_token", AuthController.verifyByToken);
router.post("/verify_otp", AuthController.verfiyByOtp)

export async function get_user_by_token(token){

    // console.log(token);
        try {

            const bearerheader = token.split(' ')
            let api_token: any;
            // console.log(bearerheader,"bbb")
            bearerheader.length >= 2 ? api_token = bearerheader[1] : api_token = bearerheader[0];

            const decoded = jwt.verify(api_token, process.env.JWT_SECRET)
            // console.log(decoded,"dddd")

            const user = await this.user.findOne({where: {uid: decoded.uid}, relations: ["Organization"]})
            // console.log(user)

            if (!user) {
                return (null)
            }
            return ({user})
            } catch (error) {
            return (null)
            }
           
}


export { router as  user_authentication_router};

