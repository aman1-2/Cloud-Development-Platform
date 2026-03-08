import { FaCss3, FaHtml5, FaJs } from 'react-icons/fa';
import { GrReactjs } from 'react-icons/gr';

export const FileIcon = ({ extension }) => {
    const iconStyle = {
        height: "18px",
        width: "18px"
    }

    const IconMapper = {
        "js": <FaJs color='yellow' style={ iconStyle } />,
        "jsx": <GrReactjs color='#61dbfa' style={ iconStyle } />,
        "css": <FaCss3 color='#3c99dc' style={ iconStyle } />,
        "html": <FaHtml5 color='#e34c26' style={ iconStyle } />
    }

    return(
        <>
            { 
                IconMapper[extension]
            }
        </>
    );
}