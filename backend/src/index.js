import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
// import path from 'path';
import chokidar from 'chokidar';
    
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/index.js';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import { handleContainerCreate } from './containers/handleContainerCreate.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(express.text());

app.use(cors());

app.use('/api', apiRouter);

app.get('/home', (req, res) => {
    return (
        res.send({
            message: "Hi from Aman!!!"
        })
    )
});

const editorNamespace = io.of('/editor');

editorNamespace.on("connection", (socket) => {
    console.log("Ediotr Connected.");
    
    let projectId = socket.handshake.query['projectId'];

    console.log("Project Id recieved after connection:",projectId);
    
    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`,{
            ignored: (path) => {
                return path.includes("node_modules");
            },
            persistent: true, /**Keeps the watcher in running state till the time app is running. */
            awaitWriteFinish: {
                stabilityThreshold: 2000 /**Ensures stability of files before triggering the events. */
            },
            ignoreInitial: true /** Ignores the initial files in directory */
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        });
    }

    handleEditorSocketEvents(socket, editorNamespace);

    socket.on("disconnect", async () => {
        await watcher.close();
        console.log("Editor Disconnected.");
    });
});

const terminalNamespace = io.of('/terminal')

terminalNamespace.on("connection", (socket) => {
    console.log("Terminal Connected");

    let projectId = socket.handshake.query['projectId']

    socket.on("shell-input", (data) => {
        console.log("Input Recieved:", data);
        terminalNamespace.emit("shell-output", data);
    });

    socket.on("disconnect", () => {
        console.log("Terminal Connected.");
    });

    handleContainerCreate(projectId, socket);
});

server.listen(PORT, () => {
    console.log(`Server Started at Port:${PORT}`);
});