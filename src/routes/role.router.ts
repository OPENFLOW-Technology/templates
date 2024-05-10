import express from "express";
import {Role} from '../entity/role.entity'
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
import RoleController from "../controller/RoleController";

const router = express.Router();
const roleController = new RoleController(); // Create an instance of the RoleController

router.get('/getRoles', roleController.getAllRoles)
router.get('/getRoleById/:id', roleController.getRoleById)
router.get('/rolerper',roleController.getRolePer);
router.post('/createRole', roleController.createRole);
router.put('/updateRole/:id', roleController.updateRole);
router.post('/deleteRole/:id', roleController.deleteRole);



export { router as  role_router};
