import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useTreeStructureStore } from "../store/treeStructureStore";

export const ProjectPlayground = () => {
    const { projectId: projectIdFromURL } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    useEffect(()=>{
        setProjectId(projectIdFromURL);
    },[])

    return (
        <>
            Project-ID: {projectIdFromURL}
            {projectId && 
                <div
                    style={{
                        backgroundColor: "#333254",
                        paddingRight: "10px",
                        paddingTop: "0.3vh",
                        minWidth: "250px",
                        maxWidth: "25%",
                        height: "99.7vh",
                        overflow: "auto"
                    }}    
                >
                    <TreeStructure />
                </div>
            }
            <EditorComponent />
            <EditorButton isActive={false} />
            <EditorButton isActive={true} />
        </>
    );
}