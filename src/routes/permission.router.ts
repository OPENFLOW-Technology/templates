import express from "express";
import {Role} from '../entity/role.entity'
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
import PermissionController from "../controller/PermissionController";

const router = express.Router();
const permissionController = new PermissionController();

router.get('/getPermissions', permissionController.getAllPermissions)
router.get('/getPermissionById/:id', permissionController.getPermissionById)
router.post('/createPermission', permissionController.createPermission);
router.put('/updatePermission/:id', permissionController.updatePermission);
// router.post('/deletePermission/:id', permissionController.deletePermission);



export { router as  permission_router};
