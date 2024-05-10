import {Request as ExpressRequest, RequestHandler} from 'express';
import { user } from '../entity/user.entity';
import {RolePermission} from "../entity/role_permission.entity";
import {sendUnauthorized} from "../utils/response..util";
interface CustomRequest extends ExpressRequest {
    user?: user;
}
export const checkPermission = (requiredPermission: string): RequestHandler => {
    return async (req: CustomRequest, res, next) => {
        try {
            const user = req.user as user; // Assuming user is the type
            const rolePermission = await RolePermission.find({
                relations: ['permission'],
                where: { role: user.role },
            });
            const hasPermission = rolePermission.some(rp=>
                // console.log(rp, "rp")
                rp.permission.name === requiredPermission
            )

            console.log(hasPermission, requiredPermission)

            if(hasPermission){
                next()
            } else {
                return sendUnauthorized(res, "You don't have permission to perform this action")
            }
        } catch (error) {
            // Handle any errors that occur during permission checking
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};
