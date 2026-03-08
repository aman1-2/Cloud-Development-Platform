import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';

export const EditorComponent = () => {
    const [editorState, setEditorState] = useState({
        theme: null  
    });

    const { editorSocket } = useEditorSocketStore();
    const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data})
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    };

    editorSocket?.on("readFileSuccess", (data) => {
        console.log("Read File Success", data);
        setActiveFileTab(data.path, data.value, )
    });

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
                    defaultLanguage='javascript'
                    defaultValue='//Welcome and Start Coding....'
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    value={activeFileTab?.value ? activeFileTab.value : "//Welcome to the Code"}
                    onMount={handleEditorTheme}
                />
            }
        </>
    );
}