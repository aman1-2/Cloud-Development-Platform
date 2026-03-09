import './FolderContextMenu.css';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';

export const FolderContextMenu = ({x, y, path}) => {
    const { editorSocket } = useEditorSocketStore();

    function handleFolderDelete() {
        console.log("Deleting folder at path:", path);
        editorSocket.emit("deleteFolder", {
            pathToFileOrFolder: path
        });
    }

    const { setIsOpen } = useFolderContextMenuStore();

    return(
        <>
            <div
                className='folderContextOptionsWrapper'

                style={{
                    left: x,
                    top: y,
                    border: "1.5px solid black",
                }}

                onMouseLeave={() => {
                    setIsOpen(false);
                }}
            >

                <button
                    className='folderContextButton'
                > 
                    Create Folder 
                </button>

                <button
                    className='folderContextButton'
                    onClick={handleFolderDelete}
                > 
                    Delete Folder 
                </button>

                <button
                    className='fileContextButton'
                > 
                    Rename Folder 
                </button>

            </div>
        </>
    );
}