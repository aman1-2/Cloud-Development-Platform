import Docker from 'dockerode';

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
    } catch (error) {
       console.log("Error while creating the container", error); 
    }
}