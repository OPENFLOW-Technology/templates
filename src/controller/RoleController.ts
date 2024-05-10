import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Role } from '../entity/role.entity';
import { RolePermission } from '../entity/role_permission.entity';
import {Permission} from "../entity/permision.entity";
import {get_user_by_token} from "../routes/auth.router";
import {sendSuccess, sendNotFound, sendBadRequest, sendUnauthorized, sendForbidden} from '../utils/response..util';
import bodyParser from 'body-parser';

class RoleController {
    // Get all roles
    async getAllRoles(req: Request, res: Response) {



      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const offset = (page - 1) * limit;

        const [role, total] = await Role.findAndCount({
            relations: ['rolePermission', 'rolePermission.permission'],
            where: { is_deleted: false},
            skip: offset,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);

        const response = {
            role,
            total,  
            totalPages,
            currentPage: page,
        }
        return sendSuccess(res, "Job title fetched", response);
    } catch (error) {
        console.error(error);
        return sendBadRequest(res, "Error while fetching Job title", error);
    }          
  }

    async getRolePer(req: Request, res: Response) {
        // const roleId = parseInt(req.params.id, 10);
        const rolePermissionRepository = getRepository(RolePermission);

        try {
            const rolePer = await rolePermissionRepository.find({
                relations: ['Role', 'Permission'],
            });
            return res.json(rolePer);
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: 'Role per not found' });
        }
    }

  // Get role by ID
  async getRoleById(req: Request, res: Response) {
    const roleID = parseInt(req.params.id, 10);
    try {
        const role = await Role.findOne({
            where: {id: roleID, is_deleted: false},
            relations: ['rolePermission', 'rolePermission.permission']
        });
          
        if (!role) {
            return sendNotFound(res, "Role not found");
        }

        // Extracting necessary data
        const basicRoleInfo = {
            name: role.name,
            isActive: role.isActive,
            permissions: role.rolePermission.map(rp => rp.permission.name)
        };

        // Return basic role info with permission IDs
        return sendSuccess(res, "Role title fetched", basicRoleInfo);
    } catch (error) {
        console.error(error);
        return sendBadRequest(res, "Error while fetching Role", error);
    }
}


  async createRole(req: Request, res: Response) {

      try {
        const { name, isActive, permissionIds } = req.body;

        if (!name || !permissionIds){
            return sendBadRequest(res, "name and permissionIds is required");            
        }
    
        // Create the role in the role table
        const role = Role.create({ 
            name , 
            isActive : isActive? isActive : true 
        });

        const newRole = await Role.save(role);
        
        // Create JobTitleDepartment entities and associate them with the job title and departments
        // for (let dep in departmentIds){
        try {
            for (const permission of permissionIds) {
      
                const found_permission = await Permission.findOne({
                    where: { id: permission }
                });
            
                if (found_permission){
                    let newRolePermission = RolePermission.create({});
                    newRolePermission.role=newRole;
                    newRolePermission.permission= found_permission;
    
                    await RolePermission.save(newRolePermission);
                }                
            }
    
            return sendSuccess(res, "Job title created successfully - ", newRole);
        } catch (error){
            return sendBadRequest(res, "PermissionIds must be an array of permissions - ", error);
        }
    } catch (error) {
        return sendBadRequest(res, "Error ", error)
    }


        // try {
        //   const { name, isActive, permissions  } = req.body;
      
        // // Create a new role and save it to the Role table
        //   const role = new Role();
        //   role.name = name;
        //   role.isActive = isActive;
        //   await role.save();

        //   try {

        //     const filteredPermissions = {};

        //     // Check if the value is truthy before adding it to the filtered object
        //     for (const [key, value] of Object.entries(permissions)) {
        //     if (value) {
        //       filteredPermissions[key] = value;
        //     }
        //   }

        //   // Iterate over the permissions and create RolePermission objects
        //   for (const permissionName in filteredPermissions) {
        //     // console.log(permissionName);

        //     let foundPermission = await Permission.findOne({
        //         where: { name: permissionName}
        //     });

        //     if (foundPermission){
        //         const newPermission = RolePermission.create();
        //         newPermission.permission = foundPermission;
        //         newPermission.role = role;
        //         await newPermission.save();
        //     } else{
        //         return sendNotFound(res, "Permission not found", permissionName);
        //     }
        //   }
        
        //   return sendSuccess(res, "Role with permission created successfully");
            
        //   } catch (error) {
        //     await role.remove();
        //     return sendBadRequest(res, "Error on adding permission to role", error);
        //   }   
        // } catch (error) {
        //   return sendBadRequest(res, "Error while adding role with permission", error);
        // }
      }
    

    // Update an existing role
    async updateRole(req: Request, res: Response) {

         
      try {
        const user_info = await get_user_by_token(req.headers.authorization);

        const roleId = parseInt(req.params.id, 10);
        const { name, permissionIds, isActive } = req.body;
    

        console.log(req.body);
        // find if there is an existing job title by id
        const foundRole = await Role.findOne({ where: { id: roleId }});
        
        if (!foundRole){
            return sendNotFound(res, "Role with the id not found");
        }
        
        Role.merge(foundRole, {name});
        foundRole.last_edited_by = user_info.user.userName;
        foundRole.last_edited_date = new Date();
        foundRole.isActive = isActive == "true" || isActive == true ? true :false;

        const updatedRole = await Role.save(foundRole);

        
        // delete/remove the previous job titles added and add the newly added only
        await RolePermission.delete({role: foundRole});

        // Create update the jobtitleDepartment table data associated with it 
        for (const permission of permissionIds) {
           
            const found_permission = await Permission.findOne({
                where: { id: permission }
            });
        
            if (found_permission){
                let newRolePermision = RolePermission.create({});
                newRolePermision.role=updatedRole;
                newRolePermision.permission= found_permission;

                await RolePermission.save(newRolePermision);
            }                
        }

        return sendSuccess(res, "Job title created successfully", updatedRole);

    } catch (error) {
        return sendBadRequest(res, "Error ", error)
    }        

      
    }

    // Delete a role
    async deleteRole(req: Request, res: Response) {
        const roleId = parseInt(req.params.id, 10);
        const {delete_reason} = req.body;
        const roleRepository = getRepository(Role);

        const authHeader = req.headers['authorization'];
        const user = await get_user_by_token(authHeader);

        if (!user) {
            return sendUnauthorized(res)
        }http://localhost/http://localhost/http://localhost/

        try {
          const role = await roleRepository.findOne({
            where: { id: Number(roleId) }
        });
        
            if (!role) {
                return sendNotFound(res, "Role not found")
            }

            if (!role.is_deleted) {
                role.is_deleted = true;
                role.deleted_date = new Date();
                role.delete_reason = delete_reason || 'No reason provided';
                role.deleted_by = user.user.userName;

                await roleRepository.save(role);
                return sendSuccess(res, "Role deleted", role)
            } else {
                return sendForbidden(res, "Role is already deleted")
            }
        } catch (error) {
            console.log(error, 'error');
            return sendBadRequest(res, "Failed to delete role",error)
        }
    }

}

export default RoleController;