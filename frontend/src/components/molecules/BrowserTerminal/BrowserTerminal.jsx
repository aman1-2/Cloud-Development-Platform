import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import'@xterm/xterm/css/xterm.css'; // required styles
import { useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
// import { io } from 'socket.io-client';
import { AttachAddon } from '@xterm/addon-attach';

import { useTerminalSocketStore } from '../../../store/terminalSocketStore';

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);
    // const socket = useRef(null);

    const { projectId: projectIdFromUrl } = useParams();

    // const ws = new WebSocket("ws://localhost:3000/terminal?projectId=" + projectIdFromUrl);

    const { terminalSocket } = useTerminalSocketStore(); 

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "Fira Code",
            theme: {
                background: "#282a37",
                foreground: "#f8f8f3",
                cursor: "#f8f8f3",
                cursorAccent: "#282a37",
                red: "#ff5544",
                green: "#50fa7c",
                yellow: "#f1f8ac",
                cyan: "#8be9fd",
            },
            convertEol: true // convert CRLF TO LF
        });

        term.open(terminalRef.current);
        let fitAddon = new FitAddon();  
        term.loadAddon(fitAddon);
        fitAddon.fit();

        // socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
        //     query: {
        //         projectId: projectIdFromUrl
        //     },
        // });

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon); 
                // socket.current = ws;
            }
        }
        

        // socket.current.on("shell-output", (data) => {
        //     term.write(data);
        // });

        // term.onData((data) => {
        //     console.log(data);
        //     socket.current.emit("shell-input", data)
        // });

        return () => {
            term.dispose();
            // socket.current.disconnet();
        }
    }, [projectIdFromUrl, terminalSocket]);
    
    return(
        <div
            id='terminal-container'

            className='terminal' 

            ref={terminalRef}
            
            style={{
                height: "25vh",
                overflow: "auto"
            }}
        >

        </div>
    );
}