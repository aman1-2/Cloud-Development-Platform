import { useEffect } from "react";

import { useTreeStructureStore } from "../../../store/treeStructureStore.js";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore.js";
import { TreeNode } from "../../molecules/TreenNode/TreeNode.jsx";
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu.jsx";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore.js";
import { FolderContextMenu } from "../../molecules/ContextMenu/FolderContextMenu.jsx";

export const TreeStructure = () => {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();
    
    const { 
        file,
        isOpen: isFileContextOpen,
        x: fileContextX, 
        y: fileContextY
    } = useFileContextMenuStore();

    const {
        folder,
        isOpen: isFolderContextOpen,
        x: folderContextX,
        y: folderContextY
    } = useFolderContextMenuStore();

    useEffect(() => {
        //If Tree-Structure exists then we need to print it. Otherwise download it and bring it.
        if(treeStructure) {
            console.log("Tree:",treeStructure);
        } else {
            setTreeStructure();
        }
    },[setTreeStructure, treeStructure]);

    return(
        <>
            {isFileContextOpen && fileContextX && fileContextY && (
                <FileContextMenu x={fileContextX} y={fileContextY} path={file} />
            )}

            {isFolderContextOpen && folderContextX && folderContextY && (
                <FolderContextMenu x={folderContextX} y={folderContextY} path={folder} />
            )}
            <TreeNode fileFolderData = {treeStructure} />
        </>
    );
}