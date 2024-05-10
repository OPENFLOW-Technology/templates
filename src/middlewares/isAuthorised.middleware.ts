import { NextFunction, Request as ExpressRequest, Response } from "express";
import config from "config";
import { sendBadRequest, sendNotFound, sendUnauthorized } from "../utils/response..util";
import { user } from "../entity/user.entity";
// import { user_info } from "../entity/user_info.entity";
var jwt = require('jsonwebtoken');
require('dotenv').config()

interface CustomRequest extends ExpressRequest {
    user?: user;
}
export const isAuthenticated = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {

      if (!!req.headers.authorization) {
        const bearerheader = req.headers.authorization.split(' ')

        let bearer;
        bearerheader.length >= 2 ? bearer = bearerheader[1] : bearer = bearerheader[0];

        jwt.verify(bearer, process.env.JWT_SECRET, async (err, authData) => {
                if (err){
                  return sendUnauthorized(res, "Auth Error")
                }
                else{

                    const loged_in_user = await user.findOne({where: {uid: authData.uid}, relations: ['role']})
                    if (loged_in_user) {
                        req.user = loged_in_user; // Set the user on the request object
                        next(); // Pass control to the next middleware
                    } else {
                        return sendUnauthorized(res);
                    }

                }

              });



        // const user = await user_info.findOne({where: {uid: decoded.uid}})
          // if (!user) {
          // return res.status(401).json({message: "Invalid token"})
          // }
          // else {next()}
          // // return res.status(200).json({user})
          // } catch (error) {
          // console.error(error)
          // // Return a 401 Unauthorized if the token is invalid or expired
          // return res.status(401).json({message: "Invalid token"})
          // }


      //   jwt.verify(bearer, process.env.JWT_SECRET, async (err, authData) => {
      //       if (err){
      //         res.sendStatus(403);
      //       }
      //       else{ next()}
      //     });
      }
      else {
        return sendUnauthorized(res);
      }
    };