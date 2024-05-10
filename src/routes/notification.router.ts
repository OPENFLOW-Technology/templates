import express from "express";
import { Notification } from "../entity/notification";
import {Request, Response} from "express";
import { getRepository } from 'typeorm';
import { isAuthenticated } from "../middlewares/isAuthorised.middleware";
import NotificationController from "../controller/NotificationController";

const router = express.Router();
const notificationController = new NotificationController(); // Create an instance of the RoleController

router.get('/getAll', isAuthenticated, notificationController.getAll)
router.post('/seeAll', isAuthenticated, notificationController.seeAll)
router.post('/create', isAuthenticated, notificationController.create)

export { router as  notification_router};
