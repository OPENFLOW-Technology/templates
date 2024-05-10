// import { Routes } from "../routes";
// import * as express from "express";
// import { func } from "joi";
// const router = express.Router();
// import { Request, Response } from "express";
// import { isAuthenticated } from "../middlewares/isAuthorised.middleware";
// import { message_controller } from "../controller/message.controller";
// import { file_controller } from "../controller/file_cloud.controller";
// import { FileUploadMiddleware } from "../middlewares/upload/fileupload.middelware";
// /**
//  * It takes a request and a response, and then it creates a new driver object, and then it sets the
//  * driver object's properties to the values of the request body, and then it saves the driver object to
//  * the database, and then it sends a response with a message and the saved driver object.
//  * @param {Request} req - Request
//  * @param {Response} res - Response
//  */


// /**
//  * @openapi
//  * /api/v1/file/list/directory/{folder_path}:
//  *   get:
//  *     tags:
//  *      - "File | Management"
//  *     description: get list of directories for the user
//  *     parameters:
//  *       - name: folder_path
//  *         in: path
//  *     responses:
//  *       200:
//  *         description: returns the directories result.
//  */
// router.get("/list/directory/:folder_path", file_controller.get_folder);



//  /**
//  * @openapi
//  * /api/v1/file/create_folder:
//  *   post:
//  *     tags:
//  *      - "File | Management"
//  *     description: Create folder to a given directory
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               folder_name:
//  *                 type: string
//  *               folder_path:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: token found
//  *       400:
//  *         description: request error
//  */
// router.post("/create_folder", file_controller.create_folder);






// /**
//  * @openapi
//  * /api/v1/file/upload_file:
//  *   post:
//  *     tags:
//  *      - "File | Management"
//  *     description: Upload file 
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file_path:
//  *                 type: string
//  *                 example: "/"
//  *               uploadedFile:
//  *                 type: file
//  *
//  *     responses:
//  *       200:
//  *         description: token found
//  *       400:
//  *         description: request error
//  */
// router.post("/upload_file", file_controller.upload_file);
  
// export { router as file_router };
