import { Response } from "express";
import { error_log } from "../entity/log.entity";


// status code 200 represents success which means request has been successfully fetched
export const sendSuccess = (res: Response, message: string, data?: any) => {
  res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// Send token will send status code 200 representing success and transfers the logged in user token
export const sendToken = (res: Response, token: string) => {
  res.status(200).json({
    status: "success",
    api_token: token
  });
};


// Forbidden to hide the existence of a resource from an unauthorized request
export const sendForbidden = (res: Response, message: string, data?: any) => {
  res.status(403).json({
    status: "fail",
    message,
    data,
  });
};


// 401 Unauthorized error would be returned is if a user tries to access a resource that is protected by authentication
export const sendUnauthorized = (res: Response, data?: any) => {
  res.status(401).json({
    status: "Unauthorized",
    message: "Resource Protected by Authentication/Check your login token.",
    data,
  });
};


// The server is unable to locate the requested resource
export const sendNotFound = (res: Response, message: string, data?: any) => {
  res.status(404).json({
    status: "fail",
    message,
    data,
  });
};


// 500 (Internal Server Error) | meaning the the request is not fulfilled because the server encounters an unexpected condition
export const sendBadRequest = async (res: Response, message: string, data?: any) => {

  // console.log(data);
  // The sendErrorRequest will log the error to the system log table
  let newlog = error_log.create();
  newlog.level = "Error 500";
  newlog.message = message + " " + data;

  await error_log.save(newlog);

  res.status(500).json({
    status: "fail",
    message,
    data,
  });
};


