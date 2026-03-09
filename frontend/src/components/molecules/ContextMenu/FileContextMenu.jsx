import './FileContextMenu.css';
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useEditorSocketStore } from '../../../store/editorSocketStore';

export const FileContextMenu = ({ x, y, path}) => {
    const { editorSocket } = useEditorSocketStore();

    function handleFileDelete() {
        console.log("Deleting file at path:", path);
        editorSocket.emit("deleteFile", {
            pathToFileOrFolder: path
        });
    }

    const { setIsOpen } = useFileContextMenuStore();
    return(
        <>
            <div
                className='fileContextOptionsWrapper'

                style={{
                    left: x,
                    top: y,
                    border: "1.5px solid black"
                }}

                onMouseLeave={() => {
                    setIsOpen(false);
                }}
            >
                <button
                    className='fileContextButton'
                    onClick={handleFileDelete}
                > Delete File </button>
                <button
                    className='fileContextButton'
                > Rename File </button>
            </div>
        </>
    );
}