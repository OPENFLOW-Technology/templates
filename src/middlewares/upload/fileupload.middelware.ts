import { sendBadRequest } from "../../utils/response..util";
import { NextFunction, Request, Response } from "express";
import { uploadImageUtil } from "../../utils/imageUpload.util";

/**
 * It takes a request, a response, and a next function as arguments. It then calls the uploadImageUtil
 * function, which returns a promise. If the promise resolves, it sets the req.body.librae property to
 * the fileName, and calls the next function. If the promise rejects, it calls the sendBadRequest
 * function, which sends a 400 response to the client
 * @param {any} req - the request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - NextFunction -&gt; This is a function that will be called when the
 * upload is complete.
 */

const upload = (toUploadFileName: string, isRequired: boolean) => {
  return function libreUpload(req: any, res: Response, next: NextFunction) {
    uploadImageUtil(req, next, toUploadFileName, isRequired)
      .then((fileName) => {
        req.body[`${toUploadFileName}`] = fileName;
        next();
      })
      .catch((e) => {
        // console.log(e);
        // sendBadRequest(res, e, undefined);
      });
  };
};

export const FileUploadMiddleware = {
  upload,
};
