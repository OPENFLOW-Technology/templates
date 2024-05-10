import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import {Organization} from "../entity/organization.entity";
import {get_user_by_token} from "../routes/auth.router";
import {sendSuccess, sendNotFound, sendBadRequest, sendUnauthorized, sendForbidden} from '../utils/response..util';
// import { _create_folder } from './file_cloud.controller';

class OrganizationController {

    async getAllOrganizations(req: Request, res: Response) {
        try {
            const authHeader = req.headers['authorization'];
            const user = await get_user_by_token(authHeader);
            if(!user) {
                return sendUnauthorized(res)
            }
            const organizationsRepository = getRepository(Organization);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const offset = (page - 1) * limit;
            const [organizations, total] = await organizationsRepository.findAndCount({
                where: [{ is_deleted: false, parentOrganizationId: user.user.organization_id}, {is_deleted: false, id: user.user.organization_id}],
                skip: offset,
                relations: ['parentOrganization'],
                take: limit,
            });

            const totalPages = Math.ceil(total / limit);

            const response = {
                organizations,
                total,
                totalPages,
                currentPage: page,
            }
            return sendSuccess(res, "Organizations fetched", response);
        } catch (error) {
            console.log(error);
            return sendBadRequest(res, "Error while fetching organizations",error);
        }
    }

    async getOrganizationById(req: Request, res: Response) {
        const organizationsRepository = getRepository(Organization);
        const { id } = req.params;
        try{
            const org = await organizationsRepository.findOne({
                where: { id: Number(id), is_deleted: false },
                relations: ['childOrganizations', 'parentOrganization'],
                 // Filter within relations
              });
            if (!org) {
                return sendNotFound(res, "Organization not found")
            }
            // filter not deleted child organization
            const chiledOrg = org.childOrganizations.filter(childOrg => childOrg.is_deleted === false);
            
            const orgData = { ...org, childOrganizations: chiledOrg }

            return sendSuccess(res, "Organization fetched", orgData)
        } catch (error) {
            return sendBadRequest(res, "Error while fetching organization",error)
        }
    }

    async createOrganization(req: Request, res: Response) {
        const organizationsRepository = getRepository(Organization);
        const { name, type, location, parentOrganizationId } = req.body;

        if (!name || !type || !location) {
            return sendForbidden(res, "Please provide all required fields")
        }

        try {
            const authHeader = req.headers['authorization'];
            const user = await get_user_by_token(authHeader);

            if(!user) {
                return sendUnauthorized(res)
            }

            
   
            // const { organization_id: parentOrganizationId } = user.user;
            let parentOrganization = null;
            if (parentOrganizationId) {
                parentOrganization = await organizationsRepository.findOne(parentOrganizationId);
                if (!parentOrganization) {
                    return sendNotFound(res, "Parent organization not found")
                }
            }

            const newOrg = organizationsRepository.create({ name, type, location, parentOrganizationId, parentOrganization: parentOrganization });
            // newOrg.parentOrganization = parentOrganization;
            
            const saved_org = await organizationsRepository.save(newOrg);
            
            return sendSuccess(res, "Organization created", saved_org)

        } catch (error) {
            console.log(error);
            return sendBadRequest(res, "Error while creating organization",error)
        }
    }


    async updateOrganization(req: Request, res: Response) {
        const organizationsRepository = getRepository(Organization);
        const { id } = req.params;
        const { name, type, location, parentOrganizationId } = req.body;


        try {

            const authHeader = req.headers['authorization'];
            const user = await get_user_by_token(authHeader);

            if (!user) {
                return sendUnauthorized(res)
            }

            
            const found_org = await organizationsRepository.findOne({
                where: { id: Number(id) }
            });

            
            if (!found_org) {
                return sendNotFound(res, "Organization to update not found" );
            }
        
            let found_parent_org = null;

            if (parentOrganizationId)
            { 
                found_parent_org = await organizationsRepository.findOne({
                    where: {id: parentOrganizationId}
                });

                if (!found_parent_org){
                    return sendNotFound(res, "Parent organization id must be valid");
                }
            }

            organizationsRepository.merge(found_org, {
                name,
                type,
                location,
                parentOrganization: found_parent_org
            });
        
            const updateOrganization = await organizationsRepository.save(found_org);
            return sendSuccess(res, "Organization updated", updateOrganization);
            
        } catch (error){
            console.log(error)
            return sendBadRequest(res, "Error while updating organization",error)
        }
    }

    async deleteOrganization(req: Request, res: Response) {
 
        try {
            const organizationsRepository = getRepository(Organization);
            const { id } = req.params;
            const { delete_reason } = req.body;
            const authHeader = req.headers['authorization'];
            const user = await get_user_by_token(authHeader);
    
            if (!user) {
                return sendUnauthorized(res)
            }
    
            const organization = await organizationsRepository.findOne({
                where: { id: Number(id), parentOrganizationId: user.user.organization_id }
            });
            
            if (!organization) {
                return sendNotFound(res, "Organization not found or You can't delete this")
            }

            if (!organization.is_deleted) {
                organization.is_deleted = true;
                organization.deleted_date = new Date();
                organization.delete_reason = delete_reason || 'No reason provided';
                organization.deleted_by = user.user.userName;

                await organizationsRepository.save(organization);
                return sendSuccess(res, "Organization deleted", organization)
            } else {
                return sendForbidden(res, "Organization is already deleted")
            }
        } catch (error) {
            return sendBadRequest(res, "Failed to delete organization", error)
        }
    }

}

export default OrganizationController;
