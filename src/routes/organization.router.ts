import express from "express";
import {Role} from '../entity/role.entity'
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
import OrganizationController from "../controller/OrganizationController";
import { isAuthenticated } from "../middlewares/isAuthorised.middleware";
const router = express.Router();
const organizationController = new OrganizationController();

router.get('/getAll', isAuthenticated, organizationController.getAllOrganizations)
router.get('/getById/:id', isAuthenticated, organizationController.getOrganizationById)
router.post('/create', organizationController.createOrganization);
router.put('/update/:id', isAuthenticated, organizationController.updateOrganization);
router.post('/delete/:id', isAuthenticated, organizationController.deleteOrganization);



export { router as organization_router};
