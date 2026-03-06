import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

export const EditorComponent = () => {
    const [editorState, setEditorState] = useState({
        theme: null  
    });

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data})
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    };

    useEffect(() => {
        // Instead of .then we can too use await function
        // fetch('./Dracula.json')
        // .then(response => response.json())
        // .then((data) => setEditorState({ ...editorState, theme: data }))

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
                    defaultValue='Welcome and Start Coding....'
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    onMount={handleEditorTheme}
                />
            }
        </>
    );
}