import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadFile = ({ fileUrl, fileName }) => {
    const handleDownload = () => {
       
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName; // Specify the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Tooltip title="Download">
            <IconButton
                onClick={handleDownload}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                }}
            >
                <DownloadIcon />
            </IconButton>
        </Tooltip>
    );
};

export default DownloadFile;
