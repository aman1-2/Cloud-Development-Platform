import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
    
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';
import { handleContainerCreate } from './containers/handleContainerCreate.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(express.text());

app.use(cors());

server.listen(4000, () => {
    console.log(`Server Started at Port: 4000`);
});

const webSocketForTerminal = new WebSocketServer({
    // noServer: true, // We will handle the upgrade event
    server
});

webSocketForTerminal.on("connection", async (ws, req, container) => {
    console.log("Terminal Connected");
    // console.log(ws, req, container);

    const isTerminal = req.url.includes("/terminal");

    if(isTerminal) {
        console.log(req.url);
        
        const projectId = req.url.split("=")[1];

        console.log("Project Id received after connection: ", projectId);
        
        const container = await handleContainerCreate(projectId, webSocketForTerminal);

        handleTerminalCreation(container, ws);
    }

    // ws.on("close", () => {
    //     container.remove({ force: true}, (err, data) => {
    //         if(err) {
    //             console.log("Error while removing container", err);
    //         } else {
    //             console.log("Container Removed", data);
    //         }
    //     });
    // });
});

// server.on("upgrade", (req, tcpSocket, head) => {
//     /**
//      * req: Incoming Http request
//      * socket: TCP socket (Which will be upgraded)
//      * head: Had meta-data around upgrading the connection.
//      */
//     // This callback will be called when a client tries to connect to the server through websocket

// });