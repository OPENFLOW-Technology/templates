import { Routes } from "./../routes";
import * as express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { user_authentication_router } from "./auth.router";
import {role_router} from "./role.router";
import {permission_router} from "./permission.router";
import {organization_router} from "./organization.router";
import {department_router} from "./department.router";
import {isAuthenticated} from "../middlewares/isAuthorised.middleware";
import { job_title_router } from "./job_title.router";
import { SystemReportRouter } from "./systemReport.router";
import { notification_router } from "./notification.router";

const router = express.Router();

// Todo : Maximum file size
// File Upload middleware registration
router.use(
  fileUpload({
    limits: { fileSize: 5 * 1024  },
  })
);

let uploadPath = path.join(__dirname, "..", "..", "uploads");

router.use(Routes.config.imagePath, express.static(uploadPath));
router.use("/auth", user_authentication_router );
router.use("/system-info",[isAuthenticated], SystemReportRouter);
router.use("/role",role_router);
router.use("/organization",organization_router);
router.use("/department",[isAuthenticated],department_router);
router.use("/permission",permission_router);
router.use("/job-title",[isAuthenticated],job_title_router);
router.use("/notification",[isAuthenticated],notification_router);


// /api/v1
export { router as RouterInitalizor };
