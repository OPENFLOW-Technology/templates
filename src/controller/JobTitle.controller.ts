    import { getRepository } from 'typeorm';
    import { Request, Response } from 'express';
    import {get_user_by_token} from "../routes/auth.router";
    import {sendBadRequest,sendNotFound,sendSuccess,sendForbidden,sendUnauthorized} from '../utils/response..util'
    import { JobTitle } from '../entity/jobtitle.entity';
    import { Department } from '../entity/department.entity';
    import { JobTitleDepartment } from '../entity/job_title_department.entity';
    class JobTitleController {

        async getAll(req: Request, res: Response) {
            try{

                const user_info = await get_user_by_token(req.headers.authorization);

                if (!user_info){
                    sendBadRequest(res, "Error user account not logged in");
                }

                try {
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = parseInt(req.query.limit as string) || 12;
                    const offset = (page - 1) * limit;

                    const [jobTitles, total] = await JobTitle.findAndCount({
                        relations: ['jobTitleDepartments', 'jobTitleDepartments.department'],
                        where: { is_deleted: false},
                        skip: offset,
                        take: limit,
                    });
        
                    const totalPages = Math.ceil(total / limit);
        
                    const response = {
                        jobTitles,
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
            catch (error){
                return sendBadRequest(res, "Error fetching department data", error);
            }
        }

        async create(req: Request, res: Response) {
    
            try {
                const { name, description, departmentIds } = req.body;
            
                // Create the job title
                const jobTitle = JobTitle.create({ name, description });
                const newJobTitle = await jobTitle.save();
                
                // Create JobTitleDepartment entities and associate them with the job title and departments
                for (const dep of departmentIds) {
              
                    const found_department = await Department.findOne({
                        where: { id: dep }
                    });
                
                    if (found_department){
                        let newJobtitleDepartment = JobTitleDepartment.create({});
                        newJobtitleDepartment.department=found_department;
                        newJobtitleDepartment.jobTitle = newJobTitle;

                        await JobTitleDepartment.save(newJobtitleDepartment);
                    }                
                }

                return sendSuccess(res, "Job title created successfully", newJobTitle)
    
            } catch (error) {
                return sendBadRequest(res, "Error ", error)
            }
        }
    
        async update(req: Request, res: Response) {
   
            try {
                const user_info = await get_user_by_token(req.headers.authorization);

                const jobTitleId = parseInt(req.params.id, 10);
                const { name, description, departmentIds } = req.body;
            
                // find if there is an existing job title by id
                const foundJobTitle = await JobTitle.findOne({ where: { id: jobTitleId }});
                
                if (!foundJobTitle){
                    return sendNotFound(res, "Job title with the id not found");
                }
                
                JobTitle.merge(foundJobTitle, {name, description});
                foundJobTitle.last_edited_by = user_info.user.userName;
                foundJobTitle.last_edited_date = new Date();

                const updatedJobTitle = await JobTitle.save(foundJobTitle);

                
                // delete/remove the previous job titles added and add the newly added only
                await JobTitleDepartment.delete({jobTitle: foundJobTitle});

                // Create update the jobtitleDepartment table data associated with it 
                for (const dep of departmentIds) {
                   
                    const found_department = await Department.findOne({
                        where: { id: dep }
                    });
                
                    if (found_department){
                        let newJobtitleDepartment = JobTitleDepartment.create({});
                        newJobtitleDepartment.department=found_department;
                        newJobtitleDepartment.jobTitle = updatedJobTitle;

                        await JobTitleDepartment.save(newJobtitleDepartment);
                    }                
                }

                return sendSuccess(res, "Job title created successfully", updatedJobTitle)
    
            } catch (error) {
                return sendBadRequest(res, "Error ", error)
            }        }
    
        async delete(req: Request, res: Response) {

            // const departmentRepository = getRepository(Department);
            const { id } = req.params;
            const { delete_reason } = req.body;
    
            const authHeader = req.headers['authorization'];
            const user = await get_user_by_token(authHeader);
    
            if (!user) {
                return sendUnauthorized(res)
            }
    
            try {
                const jobTitle = await JobTitle.findOne({
                    where: { id: Number(id) }
                  });
                  
                if (jobTitle) {
                    if (!jobTitle.is_deleted) {
                        jobTitle.is_deleted = true;
                        jobTitle.delete_reason = delete_reason || 'No reason provided';
                        jobTitle.deleted_date = new Date();
                        jobTitle.deleted_by = user.user.userName;
    
                        await JobTitle.save(jobTitle);
                        return sendSuccess(res, "Job Title Deleted successfully", jobTitle)
                    } else {
                        return sendForbidden(res, "Job Title is already deleted")
                    }
                } else {
                    return sendNotFound(res, "Job title not found")
                }
            } catch (error) {
                console.error(error);
                return sendBadRequest(res, "Failed to delete Job title",error)
            }
        }
        
        async getById(req: Request, res: Response) {

            const jobTitleId = parseInt(req.params.id, 10);
            try {
                const authHeader = req.headers['authorization'];
                const user = await get_user_by_token(authHeader);
    
                if (!user) {
                    return sendUnauthorized(res)
                }
                
                const jobTitle = await JobTitle.findOne({
                    where: {id: jobTitleId, is_deleted: false},
                    relations: ['jobTitleDepartments', 'jobTitleDepartments.department']
                });
                  
                if (!jobTitle) {
                    return sendNotFound(res, "Job-title not found")
                }
                return sendSuccess(res, "Job title fetched", jobTitle)
            } catch (error) {
                console.error(error);
                return sendBadRequest(res, "Error while fetching job title",error)
            }
    

        }
  }

    export default JobTitleController;
