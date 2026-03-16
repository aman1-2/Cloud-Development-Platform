import Docker from 'dockerode';
import { start } from 'node:repl';

export const listContainer = async() => {
    const container = await docker.listContainers();
    console.log("Containers", container);
    //Print ports array from all container
    container.forEach((containerInfo) => console.log(containerInfo.Ports));
}

const docker = new Docker();

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Project Id recieved for Container Create:", projectId);
    try {
        // Delete any existing container running with same name
        const existingContainer = await docker.listContainers({
            name: projectId
        });

        console.log("Existing container", existingContainer);

        if(existingContainer.length > 0) {
            console.log("Container already exists, stopping and removing it");
            const container = docker.getContainer(existingContainer[0].Id);
            await container.remove({force: true});
        }

        console.log("Creating a new container");

        const container = await docker.createContainer({
            Image: 'code', // Name given by us for the written dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            name: projectId,
            Tty: true,
            User: 'code',
            ExposedPorts: {
                "5173/tcp": {}
            },
            Env: [
                "HOST=0.0.0.0"
            ],
            HostConfig: { // mounting the project directory to container
                Binds: [`${process.cwd()}/projects/${projectId}:/home/code/app`],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0" // random port will be assigned by docker
                        }
                    ]
                }
            }
        });

        console.log("Container Created:", container.id);

        await container.start();

        console.log("Container Started");

        // container.exec({
        //     Cmd: ["/bin/bash"],
        //     User: "code",
        //     AttachStdin: true,
        //     AttachStdout: true,
        //     AttachStderr: true,
        // }, (err, exec) => {
        //     if(err) {
        //         console.log("Error while creating exec", err);
        //         return;
        //     }

        //     exec.start({ hijack: true}, (err, stream) => {
        //         if(err) {
        //             console.log("Error while starting exec", err);
        //             return;
        //         }

        //         // processStream(stream, socket);

        //         // socket.on("shell-input", (data) => {
        //         //     console.log("Received from frontend", data);
        //         //     stream.write("pwd\n", (err) => {
        //         //         if(err) {
        //         //             console.log("Error while writing to stream", err);
        //         //         } else {
        //         //             console.log("Data written on stream");
        //         //         }
        //         //     });
        //         // });

        //     });
        // });

        // Upgrading the connection to web-socket
        // terminalSocket.handleUpgrade(req, tcpSocket, head, (eastablishedWebSocketConnection) => {
        //     terminalSocket.emit("connection", eastablishedWebSocketConnection, req, container);
        // });

        return container;

    } catch (error) {
       console.log("Error while creating the container", error); 
    }
}

// Updating socket.io connection with raw socket connection therefore there will be update in the processStream function as well.
// function processStream(stream, socket) {
//     let buffer = Buffer.from("");

//     stream.on("data", (data) => {
//         buffer = Buffer.concat([buffer, data]);
//         socket.emit("shell-output", buffer.toString());
//         buffer = Buffer.from("");
//     });

//     stream.on("end", () => {
//         console.log("Stream Ended");
//         socket.emit("shell-output", "Stream Ended");
//     });

//     stream.on("error", (err) => {
//         console.log("Stream Error", err);
//         socket.emit("shell-output", "Stream Error");
//     });

// }

export async function getContainerPort(containerName) {
    const container = await docker.listContainers({
        name: containerName
    });

    if(container.length > 0) {
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        console.log("container info", containerInfo);
        try {
            return containerInfo.NetworkSettings.Ports["5173/tcp"][0].HostPort;
        } catch (error) {
            console.log("Port not present", error);
            return undefined;
        }
    }
}