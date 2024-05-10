import express from "express";
import {Role} from '../entity/role.entity'
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
import DepartmentController from "../controller/DepartmentController";
const router = express.Router();
const dep = new DepartmentController();

router.get('/getAll', dep.getAll)
router.get('/getById/:id', dep.getById)
router.post('/create', dep.create);
router.put('/update/:id', dep.update);
router.post('/delete/:id', dep.delete);



export { router as department_router};
