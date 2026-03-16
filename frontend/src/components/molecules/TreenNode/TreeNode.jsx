import { useState } from "react";
import { IoIosArrowForward,IoIosArrowDown } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const TreeNode = ({ fileFolderData }) => {
    const [visibility, setVisibility] = useState({});

    const { editorSocket } = useEditorSocketStore();

    const {
        setFile,
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY
    } = useFileContextMenuStore();

    const {
        setFolder,
        setIsOpen: setFolderContextMenuIsOpen,
        setX: setFolderContextMenuX,
        setY: setFolderContextMenuY
    } = useFolderContextMenuStore();

    function toggleVisibility(name) {
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        });
    }

    function computeExtension(fileFolderData) {
        const names = fileFolderData.name.split(".");
        return names[names.length-1];
    }

    function handleDoubleClick(fileFolderData) {
        console.log("Double Clicked on", fileFolderData);
        editorSocket.emit("readFile", {
            pathToFileOrFolder: fileFolderData.path
        });
    }

    function handleContextMenuForFiles(e, path) {
        e.preventDefault();
        console.log("File Right Clicked path:", path); 
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    function handleContextMenuForFolders(e, path) {
        e.preventDefault();
        console.log("Folder Right Clicked path:", path); 
        setFolder(path);
        setFolderContextMenuX(e.clientX);
        setFolderContextMenuY(e.clientY);
        setFolderContextMenuIsOpen(true);
    }

    return(
        (fileFolderData && <div

            style={{
                padding: "15px",
                color: "white"
            }}
        >
            {fileFolderData.children ? /**If the current node is folder ? */ (
                /**If current node is folder, then render it as a Button */
                <button
                    onClick={() => {
                        toggleVisibility(fileFolderData.name)
                    }} 
                    style={{
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        color: "whitesmoke",
                        backgroundColor: "transparent",
                        paddingTop: "15px",
                        fontSize: "16px",
                    }}  
                    
                    onContextMenu={(e) => handleContextMenuForFolders(e, fileFolderData.path)}
                >
                    {
                        visibility[fileFolderData.name] ? 
                        <IoIosArrowDown style={{ height: "10px", width: "10px" }} /> : 
                        <IoIosArrowForward style={{ height: "10px", width: "10px" }} />
                    }
                    {fileFolderData.name}
                </button>
            ) : (
                    /**If the current node is not a Folder, render it as a file */
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start"
                    }}>
                        <FileIcon 
                            extension={
                                computeExtension(fileFolderData)
                            }>
                        </FileIcon>

                        <p
                            style={{
                                paddingTop: "5px",
                                fontSize: "15px",
                                cursor: "pointer",
                                marginLeft: "5px", 
                            }} 
                            
                            onContextMenu={(e) => {handleContextMenuForFiles(e, fileFolderData.path)}}

                            onDoubleClick={() => handleDoubleClick(fileFolderData)}
                        >
                            {fileFolderData.name}
                        </p>
                    </div>
            )}
            
            {
                /**Recursion call for the base-case check and it 
                will not run for the file it only runs for the folder.*/
                visibility[fileFolderData.name] && fileFolderData.children && (
                    fileFolderData.children.map((child) => {
                        return <TreeNode fileFolderData={child} key={child.name}/>
                    })
                )
            }

        </div>)
    );
}