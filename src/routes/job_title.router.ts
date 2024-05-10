import express from "express";
import {Role} from '../entity/role.entity'
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
// import PermissionController from "../controller/PermissionController";
import JobTitleController from "../controller/JobTitle.controller";
const router = express.Router();


const jobtitle = new JobTitleController
router.get('/getAll', jobtitle.getAll)
router.get('/getById/:id', jobtitle.getById)
router.post('/create', jobtitle.create);
router.put('/update/:id', jobtitle.update);
router.post('/delete/:id', jobtitle.delete);



export { router as  job_title_router};
