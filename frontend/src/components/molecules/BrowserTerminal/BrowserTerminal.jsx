import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import'@xterm/xterm/css/xterm.css'; // required styles
import { useEffect, useRef } from 'react';
import { AttachAddon } from '@xterm/addon-attach';

import { useTerminalSocketStore } from '../../../store/terminalSocketStore';

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);

    const { terminalSocket } = useTerminalSocketStore(); 

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 18,
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

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon); 
            }
        }

        return () => {
            term.dispose();
            terminalSocket?.close();
        }
    }, [terminalSocket]);
    
    return(
        <div
            id='terminal-container'
            className='terminal' 
            ref={terminalRef}
            style={{
                width:"100vw"
            }}
        >

        </div>
    );
}