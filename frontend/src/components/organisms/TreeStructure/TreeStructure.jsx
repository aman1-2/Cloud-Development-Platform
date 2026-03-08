import { useEffect } from "react";

import { useTreeStructureStore } from "../../../store/treeStructureStore.js";
import { TreeNode } from "../../molecules/TreenNode/TreeNode.jsx";

export const TreeStructure = () => {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();


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
            <TreeNode fileFolderData = {treeStructure} />
        </>
    );
}