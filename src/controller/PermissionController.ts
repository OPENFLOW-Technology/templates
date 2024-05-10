import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Permission } from '../entity/permision.entity';
import {get_user_by_token} from "../routes/auth.router";
import {sendBadRequest, sendForbidden, sendNotFound, sendSuccess, sendUnauthorized} from "../utils/response..util";

class PermissionController {

    async getAllPermissions(req: Request, res: Response) {
        try {
            const permissionRepository = getRepository(Permission);

            const permissions = await permissionRepository.find({

            });

            return sendSuccess(res, "Permissions fetched", permissions)
        } catch (error) {
            return sendBadRequest(res, "Error while fetching permissions",error)
        }
    }


    async getPermissionById(req: Request, res: Response) {
        const permissionRepository = getRepository(Permission);
        const { id } = req.params;

        try {
            const permission = await permissionRepository.findOne({
                where: { id: Number(id) }
            });
            
            if (!permission) {
                return sendNotFound(res, "Permission not found")
            }
    
            return sendSuccess(res, "Permission fetched", permission)
        } catch(error){
            return sendBadRequest(res, "Error has occurred while creating permission.", error);
        }


    }

    async createPermission(req: Request, res: Response) {
        // return res.send("on maintenance");
        const { name, isActive, permission_group } = req.body;

        if (!name || isActive === undefined) {
            return sendNotFound(res, "Name and isActive are required")
        }
        
        try{
            const newPermission = Permission.create({ name, isActive, permission_group });
            const permission = await newPermission.save();
    
            return sendSuccess(res, "Permission created", permission)
        } catch(error) { 
            return sendBadRequest(res, "Error has occurred while creating permission.",error);
        }
        
    }
    async updatePermission(req: Request, res: Response) {
        const permissionRepository = getRepository(Permission);
        const { id } = req.params;
        const { name, isActive } = req.body;

        try {
            if (!name || isActive === undefined) {
                return sendNotFound(res, "Name and isActive are required")
            }
    
            const permission = await permissionRepository.findOne({where: {id: parseInt(id, 10)}});
    
            if (!permission) {
                return sendNotFound(res, "Permission not found")
            }
    
            permission.name = name;
            permission.isActive = isActive;
    
            const updatedPermission = await permissionRepository.save(permission);
            return sendSuccess(res, "Permission updated", updatedPermission)
        } catch(error){
            return sendBadRequest(res, "Error has occurred while updating permission.", error);
        }

    }

    async deletePermission(req: Request, res: Response) {
        return res.send("on maintenance");
    // //     const permissionRepository = getRepository(Permission);
    // //     const { id } = req.params;
    // //     const { delete_reason } = req.body;
    //
    // //     const authHeader = req.headers['authorization'];
    // //     const user = await get_user_by_token(authHeader);
    //
    //     if (!user) {
    //         return res.status(401).json({ error: 'Unauthorized' });
    //     }
    //
    // //     try {
    // //         const permission = await permissionRepository.findOne(id);
    //
    //         if (!permission) {
    //             return res.status(404).json({ message: 'Permission not found' });
    //         }
    //
    // //         if (!permission.is_deleted) {
    // //             permission.is_deleted = true;
    // //             permission.deleted_date = new Date();
    // //             permission.delete_reason = delete_reason || 'No reason provided';
    // //             permission.deleted_by = user.user.userName;
    //
    //             await permissionRepository.save(permission);
    //             return res.status(204).send('Permission soft-deleted');
    //         } else {
    //             return res.status(400).json({ error: 'Permission is already deleted' });
    //         }
    //     } catch (error) {
    //         return res.status(400).json({ error: 'Failed to delete permission' });
    //     }
    }

}

export default PermissionController;
