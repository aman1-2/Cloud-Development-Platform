import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {
    let timmerId = null;

    const [editorState, setEditorState] = useState({
        theme: null  
    });

    const { editorSocket } = useEditorSocketStore();
    const { activeFileTab } = useActiveFileTabStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data})
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    };

    // editorSocket?.on("readFileSuccess", (data) => {
    //     console.log("Read File Success", data);
    //     setActiveFileTab(data.path, data.value, )
    // });

    function handleChange(value) {
        //Rebouncing - Clear Old Timmer
        if(timmerId != null)    clearTimeout(timmerId);
        //Set the new Timmer
        timmerId = setTimeout(()=>{
            const editorContent = value;
            editorSocket.emit("writeFile", {
                data: editorContent,
                pathToFileOrFolder: activeFileTab.path
            });
        }, 2000);
    }

    useEffect(() => {
        downloadTheme();
    }, []);

    return (
        <>
            {
                editorState.theme &&
                <Editor 
                    height={'80vh'}
                    width={'100%'}
                    defaultLanguage={undefined}
                    language={extensionToFileType[activeFileTab?.extension]}
                    defaultValue='//Welcome and Start Coding....'
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : "//Welcome to the Code"}
                    onMount={handleEditorTheme}
                />
            }
        </>
    );
}