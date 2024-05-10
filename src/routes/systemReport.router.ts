require('dotenv').config()
import express from "express";

import { sendBadRequest, sendForbidden, sendNotFound, sendSuccess, sendToken, sendUnauthorized } from "../utils/response..util";
import { server_uptime } from "../entity/server.entity";
import { error_log } from "../entity/log.entity";
const bcrypt = require('bcrypt');
const os = require('os');
// import Client, { Folder, IQuota, ISystemInfo, Server } from "nextcloud-node-client";
// import { cloud_file_server } from "../controller/file_cloud.controller";

const router = express.Router();


router.get("/", async (req, res) => {

    try {

    
    // const client = new Client(cloud_file_server);

    // const si: ISystemInfo = await client.getSystemInfo();  

    // console.log(si)
    // const lastStartTime = await server_uptime.findOne({
    //     order: { id: "DESC" }
    //     });

    const serverInfo = {
        appName: 'Node REST API Template',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        uptime: await getUptime(),
        cpuUsage: getCpuUsage(),
        memoryUsage: getMemoryUsage(),
        // serverRestartedFromLastMaintenance: lastStartTime.id,
        // fileServerInfo: si 
        };
    
        return sendSuccess(res, "Server info fetched",serverInfo)
          
    } catch (error) {
        return sendBadRequest(res, "Error while fetching Users Information", error);
    }
})

router.get("/error-log", async (req, res) => {

  try {

  const system_error_log = await error_log.find({
    order: { id: "DESC" }
  });

  return sendSuccess(res, "Server error info fetched",system_error_log)
        
  } catch (error) {
      return sendBadRequest(res, "Error while fetching error information", error);
  }
})


async function getUptime() {
    const lastStartTime = await server_uptime.findOne({
      order: { id: "DESC" }
    });
  
    if (!lastStartTime) {
      return "Not Found";
    }
  
    const now = new Date();
    const uptimeInSeconds = (now.getTime() - (lastStartTime.initiated_timestamp as Date).getTime()) / 1000;
  
    const uptimeMinutes = Math.floor(uptimeInSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const remainingMinutes = uptimeMinutes % 60;
    const remainingSeconds = uptimeInSeconds % 60;
    // return `${uptimeHours -3} hours, ${remainingMinutes} minutes, ${remainingSeconds.toFixed(2)} seconds`;
  
    return `${uptimeHours} hours : ${remainingMinutes} minutes`;
  }

  function getCpuUsage() {
    // Get the total CPU time
    const totalCpuTime = os.cpus().reduce((acc, cpu) => {
      return acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle;
    }, 0);
  
    // Get the process CPU time
    const processCpuUsage = process.cpuUsage();
    const processCpuTime = processCpuUsage.user + processCpuUsage.system;
  
    // Calculate CPU usage percentage
    const cpuUsagePercentage = (processCpuTime / totalCpuTime) * 100;
  
    return {
      user: processCpuUsage.user,
      system: processCpuUsage.system,
      cpuUsagePercentage: cpuUsagePercentage,
    };
  }
  
  
  
  function getMemoryUsage() {
    // Logic to get memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    return {
      total: formatBytes(totalMemory),
      free: formatBytes(freeMemory),
      used: formatBytes(usedMemory),
    };
  }
  
  function formatBytes(bytes) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }



export { router as  SystemReportRouter};

