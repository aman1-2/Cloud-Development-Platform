import util from 'util';
import fs from 'fs/promises';
import child_process from 'child_process'; 

import { v4 as uuid4} from 'uuid';

const execPromisified = util.promisify(child_process.exec);

export const createProjectController = async (req, res) => {
    //Testing
    // const { stdout, stderr } = await execPromisified('dir'); // 'ls' used when we have a mac or Linux based OS.
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);



    //Create a unique id and then inside the projects folder create a new folder with that id.
    const projectId = uuid4();
    // console.log("New Project ID is:",projectId);

    await fs.mkdir(`./projects/${projectId}`);

    //After this call the npm create-vite command in the newly created project folder.
    const response = await execPromisified('npm create vite@latest code -- --template react', {
        cwd: `./projects/${projectId}`
    });

    return res.json({ 
        message: 'Created Project',
        data: projectId
    });
}