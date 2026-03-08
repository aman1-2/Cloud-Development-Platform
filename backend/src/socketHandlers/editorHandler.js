import fs from 'fs/promises';

export const handleEditorSocketEvents = (socket) => {
    socket.on("writeFile", async ({ data, pathToFileOrFolder }) => {
        try {
            const response = await fs.writeFile(pathToFileOrFolder, data);
            socket.emit("FileWriteSuccess", {
                data: "File Written Successfully"
            });
        } catch (error) {
            console.log("Error while writing the file",error);
            socket.emit("FileWriteError", {
                data: "Error Writing the File"
            });
        }
    });

    socket.on("createFile", async ({ pathToFileOrFolder }) => {
        const isFileAlreadyPresent = fs.stat(pathToFileOrFolder);
        if(isFileAlreadyPresent) {
            socket.emit("FileExistError", {
                data: "File Already Exists"
            });
            return;
        }

        try {
            const response = await fs.writeFile(pathToFileOrFolder, "");
            socket.emit("FileCreatedSuccess", {
                data: "File Created Successfully"
            });
        } catch (error) {
            console.log("Error while Creating the file.");
            socket.emit("FileCreationError", {
                data: "Error while Creating File"
            });
        }
    });

    socket.on("readFile", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.readFile(pathToFileOrFolder);
            console.log(response.toString());
            socket.emit("readFileSuccess", {
                value: response.toString(),
                path: pathToFileOrFolder
            });
        } catch(error) {
            console.log("Error Reading the File", error);
            socket.emit("FileReadingError", {
                data: "Error while Reading the file"
            });
        }
    });

    socket.on("deleteFile", async({ pathToFileOrFolder }) => {
        try {
            const response = await fs.unlink(pathToFileOrFolder);
            socket.emit("FileDeleteSuccess", {
                data: "File Deleted Successfully"
            });
        } catch (error) {
            console.log("Error Deleting the file", error);
            socket.emit("FileDeleteError", {
                data: "Error while Deleting the file"
            });
        }
    });

    socket.on("createFolder", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.mkdir(pathToFileOrFolder);
            socket.emit("FolderCreatedSuccess", {
                data: "Folder Created Successfully"
            });
        } catch (error) {
            console.log("Error while Creating the Folder.");
            socket.emit("FolderCreationError", {
                data: "Error while Creating Folder"
            });
        }
    }); 
    
    socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.rmdir(pathToFileOrFolder, { recursive: true });
            socket.emit("FolderDeletionSuccess", {
                data: "Folder is Deleted Successfully"
            });
        } catch (error) {
            console.log("Error While Deleting the Folder.",error);
            socket.emit("FolderDeletionError", {
                data: "Error in Deleting Folder"
            });
        }
    });

    
}