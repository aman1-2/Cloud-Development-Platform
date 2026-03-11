import Docker from 'dockerode';
import { start } from 'node:repl';

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
    console.log("Project Id recieved for Container Create:", projectId);
    try {
        const container = await docker.createContainer({
            Image: 'code', // Name given by us for the written dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: 'code',
            HostConfig: { // mounting the project directory to container
                Binds: [`${process.cwd()}/projects/${projectId}:/home/code/app`],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0" // random port will be assigned by docker
                        }
                    ]
                },
                ExposedPorts: {
                    "5173/tcp": {

                    }
                },
                Env: [
                    "HOST=0.0.0.0"
                ]
            }
        });

        console.log("Container Created:", container.id);

        await container.start();

        console.log("Container Started");

        container.exec({
            Cmd: ["/bin/bash"],
            User: "code",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }, (err, exec) => {
            if(err) {
                console.log("Error while creating exec", err);
                return;
            }

            exec.start({ hijack: true}, (err, stream) => {
                if(err) {
                    console.log("Error while starting exec", err);
                    return;
                }

                processStream(stream, socket);

                socket.on("shell-input", (data) => {
                    console.log("Received from frontend", data);
                    stream.write("pwd\n", (err) => {
                        if(err) {
                            console.log("Error while writing to stream", err);
                        } else {
                            console.log("Data written on stream");
                        }
                    });
                });
            });
        });

    } catch (error) {
       console.log("Error while creating the container", error); 
    }
}

function processStream(stream, socket) {
    let buffer = Buffer.from("");
    stream.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);
        socket.emit("shell-output", buffer.toString());
        buffer = Buffer.from("");
    });

    stream.on("end", () => {
        console.log("Stream Ended");
        socket.emit("shell-output", "Stream Ended");
    });

    stream.on("error", (err) => {
        console.log("Stream Error", err);
        socket.emit("shell-output", "Stream Error");
    });


}