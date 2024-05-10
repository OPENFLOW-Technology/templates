import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Department } from '../entity/department.entity';
import { Organization } from '../entity/organization.entity';
import {get_user_by_token} from "../routes/auth.router"; // Import the Organization entity
import {sendSuccess, sendNotFound, sendBadRequest, sendUnauthorized, sendForbidden} from '../utils/response..util';
// import { DepartmentOrganization } from '../entity/departmentOrganization.entity';

class DepartmentController {
    async getAll(req: Request, res: Response) {
        
        try{

            // get the logged in user and return that logged in users organization only
            const user_info = await get_user_by_token(req.headers.authorization);

            if (user_info){

                const departmentRepository = getRepository(Department);

                try {
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = parseInt(req.query.limit as string) || 12;
                    const offset = (page - 1) * limit;
        
                    const [deps, total] = await departmentRepository.findAndCount({
                        relations: ['departmentOrganization', "departmentOrganization.organization"],
                        where: { is_deleted: false},
                        skip: offset,
                        take: limit,
                    });
        
                    const totalPages = Math.ceil(total / limit);
        
                    const response = {
                        deps,
                        total,
                        totalPages,
                        currentPage: page,
                    }
                    return sendSuccess(res, "Departments fetched", response);
                } catch (error) {
                    console.error(error);
                    return sendBadRequest(res, "Error while fetching departments",error);
                }
            }         
        }
        catch (error){
            return sendBadRequest(res, "Error fetching department data", error);
        }
    }

    async getById(req: Request, res: Response) {
        const depId = parseInt(req.params.id, 10);
        const user_info = await get_user_by_token(req.headers.authorization);

        try {
            const dep = await Department.findOne({
                where: {id: depId, is_deleted: false},
                relations: ['departmentOrganization', "departmentOrganization.organization"]
            });
              
            if (!dep) {
                return sendNotFound(res, "Department not found")
            }
            return sendSuccess(res, "Department fetched", dep)
        } catch (error) {
            console.error(error);
            return sendBadRequest(res, "Error while fetching department",error)
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, description, organizationIds } = req.body;
        
           // Create the job title
            const department = Department.create({ name, description });
            const newDepartment  = await Department.save(department);
            
            return sendSuccess(res, "Department created successfully", newDepartment)

        } catch (error) {
            return sendBadRequest(res, "Error ", error)
        }
    }

    async update(req: Request, res: Response) {

        try {
            const user_info = await get_user_by_token(req.headers.authorization);

            const departmentId = parseInt(req.params.id, 10);
            const { name, description  } = req.body;
        
            const foundDepartment = await Department.findOne({ where: { id: departmentId }});
            
            if (!foundDepartment){
                return sendNotFound(res, "Department with the specified id not found");
            }
            
            Department.merge(foundDepartment, {name, description});
            foundDepartment.last_edited_by = user_info.user.userName;
            foundDepartment.last_edited_date = new Date();

            const updatedDepartment = await Department.save(foundDepartment);        
            return sendSuccess(res, "Job title created successfully", updatedDepartment)

        } catch (error) {
            return sendBadRequest(res, "Error ", error)
        }   
    }

    async delete(req: Request, res: Response) {
        const departmentRepository = getRepository(Department);
        const { id } = req.params;
        const { delete_reason } = req.body;

        const authHeader = req.headers['authorization'];
        const user = await get_user_by_token(authHeader);

        if (!user) {
            return sendUnauthorized(res)
        }

        try {
            const dep = await departmentRepository.findOne({
                where: { id: Number(id)}
              });
              
            if (dep) {
                if (!dep.is_deleted) {
                    dep.is_deleted = true;
                    dep.delete_reason = delete_reason || 'No reason provided';
                    dep.deleted_date = new Date();
                    dep.deleted_by = user.user.userName;

                    await departmentRepository.save(dep);
                    return sendSuccess(res, "Department deleted", dep)
                } else {
                    return sendForbidden(res, "Department is already deleted")
                }
            } else {
                return sendNotFound(res, "Department not found")
            }
        } catch (error) {
            console.error(error);
            return sendBadRequest(res, "Failed to delete department",error)
        }
    }

}

export default DepartmentController;
