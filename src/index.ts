import { createConnection } from "typeorm";
import express from "express";
import { RouterInitalizor } from "./routes/initalizor.router";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "config";
import cors from "cors";
import { RawData, WebSocket } from "ws";
import { server_uptime } from "./entity/server.entity";
import WebSocketManager from "./websockets/manager";

require('dotenv').config()  

const jwt = require("jsonwebtoken")
const fileUpload = require('express-fileupload');


// const formidable = require('express-formidable');
const formData = require("express-form-data");

const host = config.get("dbConfig");
const swaggerConfig = config.get("swaggerConfig");

createConnection(host)
  .then(async () => {
    console.log("DB Connected");
    const app = express();
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws: WebSocket) => {
      let userId = undefined;
      console.log("New websocket connected")
      ws.on('message', (data) => {
        let message = data.toString()
        if (message.startsWith("auth")) {
          message = message.slice(5)
          console.log(message, process.env.JWT_SECRET)
          jwt.verify(message, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
              userId = decoded.uid
              WebSocketManager.addConnection(userId, ws)
            } else {
              console.log(err)
            }
          })
        }
      });

      ws.on('close', () => {
        WebSocketManager.removeConnection(userId, ws)
      });
    });

    // app.use(express.json());
    app.use(cors());
    // app.use(fileUpload());

    app.use(express.json({ limit: '10000mb' }));
    app.use(express.urlencoded({ limit: '10000mb', extended: true }));
    

    // save server start time
    const uptimeRecord = server_uptime.create();
    await uptimeRecord.save();

    // Serve static files from the 'uploads' folder
    app.use('/uploads', express.static('uploads'));

    // form data fix
    // app.use(formData.parse());

    // Put this statement near the top of your module
    var bodyParser = require('body-parser');


    // Put these statements before you define any routes.
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());


    app.use("/api/v1/", RouterInitalizor);
    app.get("/", (req, res) => {

      const serverInfo = {
        message: "Hello 👋 This is the server speaking",
        appName: 'Node REST API Template',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        server_status: "API Running",

      };

      res.send(serverInfo);
    });

    // // Custom 404 handler
    // app.use((req, res) => {
    //   res.status(404).send('404 Route Not Found');
    // });

    const swaggerSpec = swaggerJSDoc(swaggerConfig);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Server listening ");
    let server = app.listen(4000);

    // Use same port for websockets
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
      });
    });    
  })
  .catch((error) => console.log(error));
