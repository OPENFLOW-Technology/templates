import { Request } from "express";

import { v4 as uuidv4 } from "uuid";
import path from "path";

/**
 * It takes a request object, a file name, and a boolean value. If the boolean value is true, it checks
 * if the request object has a file with the given file name. If it does, it uploads the file to the
 * server. If the boolean value is false, it returns a string saying "No files were uploaded".
 * @param {any} req - any -&gt; The request object
 * @param {string} fileName - The name of the file you want to upload.
 * @param {boolean} isRequired - boolean -&gt; If the file is required or not
 * @returns A promise.
 */
export const uploadImageUtil = (
  req: any,
  next: Function,
  fileName: string,
  isRequired: boolean
) => {
  return new Promise((resole, reject) => {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files[`${fileName}`]
    ) {
      console.log(isRequired);
      if (isRequired) reject(fileName + " is required .");
      else next();
    } else {
      let toUploadFile: any = req.files[`${fileName}`];
      let uploadPath = path.join(__dirname, "..", "..", "uploads", "/");

      if (toUploadFile) {
        let extention1: string = toUploadFile.name;

        let lastIndex1 = extention1.lastIndexOf(".");
        extention1 = extention1.substring(lastIndex1);
        let uploadFileName1 = uuidv4() + extention1;

        saveImageToFile(toUploadFile, uploadPath, uploadFileName1)
          .then((uploadedFileName) => {
            resole(uploadedFileName);
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        if (isRequired) reject(fileName + " is required .");
        else next();
      }
    }
  });
};

const saveImageToFile = (uploadFile, uploadPath, uploadFileName) => {
  return new Promise((resolve, reject) => {
    uploadFile.mv(uploadPath + uploadFileName, async (err: any) => {
      if (err) reject(err);
      resolve(uploadFileName);
    });
  });
};
