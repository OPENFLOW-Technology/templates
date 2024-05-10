import { Request, Response } from 'express';
import { sendBadRequest, sendForbidden, sendNotFound, sendSuccess, sendToken, sendUnauthorized } from '../utils/response..util';
import { Organization } from '../entity/organization.entity';
import { Department } from '../entity/department.entity';
import { JobTitle } from '../entity/jobtitle.entity';
import { Role } from '../entity/role.entity';
import { user } from '../entity/user.entity';
import signToken from '../utils/tokenSign';
import { get_user_by_token } from '../routes/auth.router';
import { getRepository } from 'typeorm';
import NotificationController from './NotificationController';
import { generateOTP } from '../utils/otpGenerator';
import { sendSMS } from './send-sms';
import { RolePermission } from '../entity/role_permission.entity';
const bcrypt = require('bcrypt');
// var passwordHasher = require('aspnet-identity-pw');
var jwt = require('jsonwebtoken');
require('dotenv').config()

class AuthController {
    static async  createUser(req: Request, res: Response) {
        try {
    
            // Extract email, password, and other user details from the request body
            const {
                email, password, phone_number, first_name, father_name, last_name,
                password_confirmation, role_id, job_title, sex, department, organization_id
            } = req.body
    
            //   check password confirmation match
            if (password!= password_confirmation)
                return sendBadRequest(res, "Password don't match. Please make sure the password confirmation matches your password.", req.body);
    
            // Check if a user with the same phone number already exists
            const existingUser = await user.findOne({where: {phoneNumber: phone_number}});
            if (existingUser)
                return sendBadRequest(res, "A user with this email/phone number already exists", req.body);
            
            // check required information
            if (!organization_id || !department || !job_title || !role_id || !phone_number || !password || !first_name || !father_name)
                return sendNotFound(res, "Required fields missing, Please fill all the required fields.");

            // check organization if found or not
            const found_organization = await Organization.findOne({where: {id: organization_id}});
            
            if (!found_organization) {
                return sendNotFound(res, "Organization not found")
            }

            // Check department if found or not
            const found_department = await Department.findOne({where: {id: department}}) 
            
            if(!found_department){
                return sendNotFound(res, "Department not found");
            }

            // Check job title if found or not
            const found_job_title = await JobTitle.findOne({where: {id: job_title}});
            
            if(!found_job_title){
                return sendNotFound(res, "Job title not found");
            }

            // Check role if found or not
            const found_role = await Role.findOne({where: { id: role_id}});
    
            if(!found_role){
                return sendNotFound(res, "Role not found");
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await user.create({});
    
            newUser.Organization = found_organization;
            newUser.organization_id = organization_id;
            newUser.role = found_role;
            newUser.is_active = true;
            newUser.email = email;
            newUser.firstName = first_name;
            newUser.lastName = last_name;
            newUser.userName = first_name+ " " + father_name + " " + last_name;
            newUser.Job_Title = found_job_title;
            newUser.passwordHash = hashedPassword;
            newUser.phoneNumber = phone_number;

            newUser.department = found_department;
    
            const saved_user = await user.save(newUser);
            // Generate a JSON web token with the user's id and a secret key
            const api_token = signToken(saved_user.uid)
    
            // Return the JSON web token and a status code of 201 Created
            return sendToken(res, api_token)
    
        } catch (error) {
            // Return a 500 Internal Server Error if there is any error while creating the user
            return sendBadRequest(res, "Add user", error)
        }
    
    }

    static async getAllUser(req : Request, res:Response) {
        const authHeader = req.headers['authorization'];
        const found_user_user = await get_user_by_token(authHeader);
        if (!found_user_user) {
            return sendUnauthorized(res, "Error logging in");
        }

        try {

            const allUserInfo = await user.find({
                where: { is_deleted: false}
            });
            
            return sendSuccess(res, "All Users fetched", allUserInfo);
        } catch (error) {
            return sendBadRequest(res, "Error while fetching Users Information", error);
        }
    }

    static async getUser(req: Request, res: Response) {
        const authHeader = req.headers["authorization"];
        const found_user = await get_user_by_token(authHeader);
        const userRepository = getRepository(user);

        if(!found_user) {
            return sendUnauthorized(res, "Error logging in");
        }

        try {

            const { uid: userId} = req.params;
            
            const found_user = await userRepository.findOne({
                where: {uid: userId},
                relations: ['role', 'Organization','Job_Title' ]
            })

            if (!found_user) {
                return sendNotFound(res, 'User with the provided UID: '+userId+' not found' );
            }
            
            return sendSuccess(res, "User data fetched", found_user);
        } catch (error) {
            return sendBadRequest(res, "Error while fetching user Informaiton", error)
        }
    }

    static async login(req:Request, res:Response) {
        // const notificationRepository = getRepository(Notification);
        const userRepository = getRepository(user);

        const { phone_number, password } = req.body;

        try {
            // Find the user with the phone number in the database
            const user = await userRepository.findOne({ where: { phoneNumber: phone_number } });

            // Return a 401 Unauthorized if the user with the phone number is not found
            if (!user) {
                return sendUnauthorized(res, "Invalid phone number or password");
            }

            // Compare the provided password with the stored password hash using bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

            
            if (!isPasswordValid) {
                return sendUnauthorized(res, "Invalid phone number or password");
            }

            // Generate a JSON web token with the user's ID and a secret key
            const api_token = signToken(user.uid)

            // Make a notification for logging in
            const title: string = "Successful login"
            const description: string = "You have successfully logged in"
            const link: string = "/"
            const state: string = "success"

            try {
                NotificationController.createNotification(user, title, description, link, state);
            } catch (E) {
                console.log(E)
            }

            return sendToken(res, api_token);

        } catch (error) {
            // Return a 500 Internal Server Error if there is any error while logging in
            return sendBadRequest(res, "Login Error", error);
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            // Extract user details from the request body
            const { 
                email, userName, phone_number, first_name, father_name, last_Name,
                role_id, job_title, sex, department, organization_id
            } = req.body;
    
            const uid = req.params.uid;
    
            const userRepository = getRepository(user);
    
            const found_user = await userRepository.findOne({where: {uid: uid}});
    
            if (!found_user) {
                return sendNotFound(res, 'User with the provided UID: '+uid+' not found' );
            }
    
    
            if (!organization_id)
                return sendNotFound(res, "Organization ID is required")
    
            const found_organization = await Organization.findOne({where: {id: organization_id}});
            const found_job_title = await JobTitle.findOne({where: {id: job_title}});
            const found_role = await Role.findOne({where: { id: role_id}});
    
    
            if (!found_organization) {
                return sendNotFound(res, "Organization not found")
            }
            
            if(!found_role){
                return sendNotFound(res, "Role not found");
            }
    
            if(!found_job_title){
                return sendNotFound(res, "Job title not found");
            }
    
            // const passwordHash = await bcrypt.hash(password, 10);
    
    
            userRepository.merge(found_user, {
                email, userName, phoneNumber: phone_number, firstName: first_name, lastName: last_Name,
                role: found_role, Job_Title: found_job_title, department, organization_id, Organization: found_organization
            });
    
            const updatedUser = await userRepository.save(found_user);
            return sendSuccess(res, 'User updated successfully', updatedUser);
    
        } catch (error) {
            sendBadRequest(res, "Update User", error);
        }
    }

    static async updateLoginUser(req: Request, res:Response) {
        const authHeader = req.headers['authorization'];
        const userRepository = getRepository(user);
        try {
            // Extract user details from the request body
            const { 
                email, first_name, 
                last_Name, father_name, sex
            } = req.body;
    
            // extract the updatable user from the logged in employee header token
            // Get the user based on the authentication token
            const authenticatedUser = await get_user_by_token(authHeader);
    
            if (!authenticatedUser) {
                // User token has expired or not working 
                return sendUnauthorized(res, "User can not be found from the token provided.");
            }
    
            let found_user = authenticatedUser.user;
    
            userRepository.merge(found_user, {
                email, firstName: first_name, lastName: last_Name
            });
    
            const updatedUser = await user.save(found_user);
            return sendSuccess(res, 'User updated successfully', updatedUser);
        } catch (error) {
            sendBadRequest(res, "Update User", error);
        }
    }


    static async updateUserPassword(req: Request, res: Response) {
        const userRepository = getRepository(user);
        // Extract user details from the request body
        const { new_password, confirm_password, reset_reason } = req.body;
    
        const { uid } = req.params;

        if (!reset_reason)
            return sendNotFound(res, "Password reset reason is required.");

        try {
            
            const found_user = await userRepository.findOne({where: {uid: uid}});
    
            if (!found_user){
                return sendNotFound(res, "User with uid : "+ uid + " not found");
            }
    
            // Check if the password and password_confirmation match
            if (new_password !== confirm_password) {
                return sendForbidden(res, "Password doesn't match. Please make sure the password confirmation matches your password.");
            }
    
            // Update the user's password
            found_user.passwordHash = await bcrypt.hash(new_password, 10);
            // found_user.password_reset_reason = reset_reason;
    
            const updated_user = await userRepository.save(found_user);
    
            return sendSuccess(res, "User password updated successfully", updated_user);
        } catch (error) {
             // send 500 and save the error to log file
             sendBadRequest(res, "Update Password", error);
        }
    }

    static async updateLoginUserPassword(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const userRepository = getRepository(user);

        try {
            // Extract user details from the request body
            const { current_password, new_password, confirm_password } = req.body;
    
            // Get the user based on the authentication token
            const authenticatedUser = await get_user_by_token(authHeader);
    
            if (!authenticatedUser) {
                // User token has expired or not working 
                return sendUnauthorized(res, "User can not be found from the token provided.");
            }
    
            // Check if the password and password_confirmation match
            if (new_password !== confirm_password) {
                return sendForbidden(res, "Password doesn't match. Please make sure the password confirmation matches your password.");
            }

            // check the user current password
            // const hashedPassword = await bcrypt.hash(current_password, 10);
            if (await bcrypt.compare(current_password, authenticatedUser.user.passwordHash)){
                // Update the user's password
                authenticatedUser.user.passwordHash = await bcrypt.hash(new_password, 10);
                const updated_user = await userRepository.save(authenticatedUser.user);
    
                return sendSuccess(res, "User password updated successfully", updated_user );
            } else{ 
                return sendUnauthorized(res, "Password Dont match from old password");
            }            
        } catch (error) {
             // send 500 and save the error to log file
             sendBadRequest(res, "Update Password", error);
        }
    }

    static async resetPassword(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const userRepository = getRepository(user);
        try {
            // Extract user details from the request body
            const { password, password_confirmation } = req.body;
    

            if (!password || !password_confirmation) 
                return sendNotFound(res, "All filde are required.");
            // Check if the password and password_confirmation match
            if (password !== password_confirmation) {
                return res.status(400).json({ message: "Password doesn't match. Please make sure the password confirmation matches your password." });
            }
    
            // Get the user based on the authentication token
            const authenticatedUser = await get_user_by_token(authHeader);
    
            if (!authenticatedUser) {
                return sendUnauthorized(res);
            }
    
            // Check if a new password is provided and update it if necessary
            if (password) {
                // Hash the new password
                const hashedPassword = bcrypt.hashPassword(password);
                authenticatedUser.user.passwordHash = hashedPassword;
            }
    
            // Save the updated user
            const updated_user = await userRepository.save(authenticatedUser.user);
    
            return sendSuccess(res, "User password updated successfully", updated_user );
    
        } catch (error) {
             // send 500 and save the error to log file
             sendBadRequest(res, "Reset Password", error);
        }
    }

    static async forgetPassword(req: Request, res: Response) {
        const userRepository = getRepository(user);
        try {
            const { phone_number } = req.body;
    
            // Find the user based on phone_number
            const found_user = await user.findOne({ where: { phoneNumber: phone_number } });
    
            if (!found_user) {
                return sendNotFound(res, "User not found by phone", phone_number );
            }
    
            const otp = generateOTP();
            sendSMS(phone_number, otp, 'otp_1')
    
            found_user.forgotten_password_token = otp;
            await userRepository.save(found_user);
            return res.status(200).json({ message: "Password reset otp sent" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error resetting password. Please try again later." });
        }
    }

    static async delateUserById(req: Request, res: Response) {
        const userRepository = getRepository(user);
        const authHeader = req.headers['authorization'];
        try {
            
            const { uid: user_id } = req.params;
            const { delete_reason } = req.body;
    
            // Get the user based on the authentication token
            const authenticatedUser = await get_user_by_token(authHeader);
    
            if (!authenticatedUser) {
                return sendUnauthorized(res);
            }
    
            // Find the user based on phone_number
            const user = await userRepository.findOne({ where: { uid: user_id }});
    
            if (!user) {
                return sendNotFound(res, "User by user id :" +user_id+ "not found" );
            }
    
            // update the user delete status
            user.is_deleted = true;
            user.deleted_date = new Date();
            user.delete_reason = delete_reason || 'No reason provided';
            user.deleted_by =  authenticatedUser.user.userName;
    
            const saveDelete = await userRepository.save(user);
            return sendSuccess(res, 'User deleted successfully', saveDelete);
            
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ message: "Error Deleting user.", error });
        }
    }

    static async verifyByToken(req: Request, res: Response) {
        const userRepository = getRepository(user);
        // Extract token from the request body
        const {api_token} = req.body
        try {
            // Verify the token with a secret key
            const decoded = jwt.verify(api_token, process.env.JWT_SECRET)
            const user = await userRepository.findOne({
                relations: ['role'],
                where: {uid: decoded.uid}
            })
            if (!user) {
                return sendUnauthorized(res);
            }
    
            try{

                let found_role = await Role.findOne({
                    where: { id: user.role.id },
                });
    
    
                const role_permissions = await RolePermission.find({
                  relations: ['permission'],
                  where: { role: found_role },
                });
          
                const permissions = role_permissions.reduce((acc, rp) => {
                  acc[rp.permission.name] = rp.permission.isActive;
                  return acc;
                }, {});
          
                let roleWithPermissions = {
                  // id: found_role.id,
                  // name: found_role.name,
                  // isActive: found_role.isActive,
                  // is_deleted: found_role.is_deleted,
                  // deleted_date: found_role.deleted_date,
                  // delete_reason: found_role.delete_reason,
                  // deleted_by: found_role.deleted_by,
                  permissions,
                };
          
              //   return sendSuccess(res, "Role with permission found", roleWithPermissions);
      
      
              let userWithRoles = {...user, ... roleWithPermissions} 
              // console.log(user);
      
              
              return sendSuccess(res, "User information by token", userWithRoles);
      
            } catch (error){
                return sendBadRequest(res, "Role not found in user information", error);
            }
             
        } catch (error) {
            // send 500 and save the error to log file
            sendBadRequest(res, "Token Error", error);
        }
    }

    static async verfiyByOtp(req: Request, res: Response) {
        const userRepository = getRepository(user);
        // Extract email, and password from the request body
        const {phone_number, otp} = req.body
    
        try {
        // Find the user with the same email in the database
        const user = await userRepository.findOne({ where: { phoneNumber: phone_number } });
    
        if (user){
    
            if (!user.forgotten_password_token){
                // Return a 401 Unauthorized if the user with the email is not found or if the password is invalid
                if ( otp != user.verification_OTP) {
            
                    user.otp_trial_count +=1;
                    user.save();
                    if (user.otp_trial_count >3){
                        return res.status(401).json({message: "Too many trials, Please request another OTP Key"})    
                    }
                    return res.status(401).json({message: "Invalid OTP"})    
                }
                user.otp_verified= true;
                user.save();
            
            
                // Generate a JSON web token with the user"s id and a secret key
                const api_token = signToken(user.uid)
                
                sendSMS(user.phoneNumber, user.firstName + user.lastName, "welcome_1");
                    
                // Return the JSON web token and a status code of 200 OK
                return res.status(200).json({api_token})
            } else {
                // Return a 401 Unauthorized if the user with the email is not found or if the password is invalid
                if ( otp == user.forgotten_password_token) {
                            
                    // Generate a JSON web token with the user"s id and a secret key
                    const api_token = signToken(user.uid)
                    
                    user.forgotten_password_token = null;
                    user.save();
    
                    // Return the JSON web token and a status code of 200 OK
                    return res.status(200).json({api_token})
                }
                return res.status(401).json({message: "Invalid OTP"})
                
            }
        
        
        } else { res.status(404).json("user not found")}
       
    } catch (error) {
        // Return a 500 Internal Server Error if there is any error while logging in
        return res.status(500).json({message: "Error logging in. Please try again later."})
        }
    }
}

export default AuthController;