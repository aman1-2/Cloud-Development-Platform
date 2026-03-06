import fs from 'fs/promises';
import { v4 as uuid4} from 'uuid';
import { execPromisified } from '../utils/execUtility.js';
import path from 'path';

import directoryTree from 'directory-tree';

import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';

export const createProjectService = async () => {
    //Create a unique id and then inside the projects folder create a new folder with that id.
    const projectId = uuid4();
    // console.log("New Project ID is:",projectId);

    await fs.mkdir(`./projects/${projectId}`);

    //After this call the npm create-vite command in the newly created project folder.
    const response = await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export const getProjectTreeService = async (projectId) => {
    const projectPath = path.resolve(`./projects/${projectId}`);
    const tree = directoryTree(projectPath);
    return tree;
}