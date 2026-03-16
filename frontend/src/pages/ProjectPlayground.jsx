import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Divider } from 'antd';
import { Allotment } from 'allotment';
import "allotment/dist/style.css";

import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
// import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { Browser } from "../components/organisms/Browser/Browser";

export const ProjectPlayground = () => {
    const { projectId: projectIdFromURL } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { setEditorSocket } = useEditorSocketStore();

    const { setTerminalSocket, terminalSocket } = useTerminalSocketStore();

    const [ loadBrowser, setLoadBrowser ] = useState(false);

    useEffect(()=>{
        if(projectIdFromURL) {
            setProjectId(projectIdFromURL);

            const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromURL
                }
            });

            try {
                const ws = new WebSocket("ws://localhost:4000/terminal?projectId=" + projectIdFromURL); 
                setTerminalSocket(ws);
            } catch (error) {
                console.log("Error while setting web-socket: ",error);
            }
            
            setEditorSocket(editorSocketConn);
        }
    },[setProjectId, projectIdFromURL, setEditorSocket, setTerminalSocket]);

    return (
        <>
            <div
                style={{
                    display: "flex"
                }}
            >
                { 
                    projectId && (
                    <div
                        style={{
                            backgroundColor: "#333254",
                            paddingRight: "10px",
                            paddingTop: "0.3vh",
                            minWidth: "250px",
                            maxWidth: "25%",
                            height: "100vh",
                            overflow: "auto"
                        }}    
                    >
                        <TreeStructure />
                    </div>
                )}

                <div
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                >
                    <Allotment>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#282a36"
                            }}
                        >
                            <Allotment vertical={true}>
                                <EditorComponent />

                                {/* <Divider style={{ color: "white", backgroundColor: "#333254"}} plain> Terminal </Divider> */}

                                <BrowserTerminal />
                            </Allotment>

                        </div>

                        <div>
                            <Button onClick={() => setLoadBrowser(true)}>
                                Load My Browser
                            </Button>
                            { loadBrowser && projectIdFromURL && terminalSocket && <Browser projectId={projectIdFromURL} />}
                        </div>

                    </Allotment>

                </div>

            </div>
            
            {/* <EditorButton isActive={false} />
            <EditorButton isActive={true} /> */}

            
        </>
    );
}