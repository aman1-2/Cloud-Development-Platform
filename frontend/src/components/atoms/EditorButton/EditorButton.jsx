import './EditorButton.css';

export const EditorButton = ({ isActive }) => {
    function handleClick() {
        //TODO: Implement Handle-click
    }
    return (
        <>
            <button
                className="editor-button"
                style={{
                    color: isActive ? 'white' : '#6272a4',
                    backgroundColor: isActive ? '#303242' : '#4a4859',
                    borderTop: isActive ? '1px solid #f7b9dd' : 'none'
                }}
                onClick={handleClick}
            >
                file.js
            </button>
        </>
    );
}