import Docker from 'dockerode';

const docker = new Docker();

export const listContainer = async() => {
    const containers = await docker.listContainers();
    console.log("Containers", containers);
    //Print ports array from all container
    containers.forEach((containerInfo) => console.log(containerInfo.Ports));
}

export const handleContainerCreate = async (projectId) => {
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
            Volumes: {
                "/home/code/app": {}
            },
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

        return container;
    } catch (error) {
       console.log("Error while creating the container", error); 
    }
}

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