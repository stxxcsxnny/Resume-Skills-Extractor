import { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import RoundaboutLeftIcon from '@mui/icons-material/RoundaboutLeft';
import { Tooltip } from '@mui/material';

export default function FilePreview({ file }) {
  const [docxHtml, setDocxHtml] = useState('');
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // Store file URL

  useEffect(() => {
    if (!file) return;

    // Revoke old URL if exists
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    // Create new URL
    const newUrl = URL.createObjectURL(file);
    setFileUrl(newUrl);

    if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          setDocxHtml(value);
        } catch (err) {
          setError('Failed to preview Word document.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setDocxHtml('');
    }

    // Cleanup on component unmount
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

    if (!file) return (<div>
        <p className="text-gray-600 font-bold mt-10 lg:mb-10">Drop That Resume—Let’s Harvest the Best Skills!</p>
          <RoundaboutLeftIcon style={{ fontSize: '100px', color: '#1f2937' }} />
          
    </div>)

  const isPDF = file.type === 'application/pdf';
  const isDOCX =
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return (
    <div className="flex flex-col overflow-hidden m-0">
      <Tooltip title="Details" className="self-end m-0">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex justify-center self-end items-center bg-gray-800 text-white rounded-full h-6 w-6"
          title="Toggle Details"
        >
          {showDetails ? <InfoIcon /> : <InfoOutlineIcon />}
        </button>
      </Tooltip>

      {isPDF && fileUrl && (
        <iframe
          src={fileUrl}
          className="w-full h-64  mt-1 border"
          title="PDF Preview"
        />
      )}

      {isDOCX && (
        <div className="mt-2 h-64 overflow-y-auto border p-2 text-sm">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
          )}
        </div>
      )}

      {!isPDF && !isDOCX && fileUrl && (
        <div className="mt-4">
          <p className="text-gray-600">
            Preview not available for this file type.
          </p>
          <a
            href={fileUrl}
            download={file.name}
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download {file.name}
          </a>
        </div>
      )}

      {showDetails && (
        <div className="mt-1 text-left  px-2">
          <p 
       className="animate-fadeInUp text-[10px] text-cyan-900 leading-tight
      hover:bg-blue-200 transition 
      duration-100 ease-in-out
      transform
      opacity-0 scale-90
      animate-fadeInScale
      hover:scale-105"
      style={{ animationDelay: '100ms' }}
    >
      <strong>File Name:</strong> {file.name}
    </p>
    <p
      className="animate-fadeInUp  text-[10px] text-cyan-900 leading-tight
      hover:bg-blue-200 transition 
      duration-300 ease-in-out
      transform
      opacity-0 scale-90
      animate-fadeInScale
      hover:scale-105"
      style={{ animationDelay: '300ms' }}
    >
      <strong>File Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
    </p>
    <p
      className="animate-fadeInUp text-[10px] text-cyan-900 leading-tight
      hover:bg-blue-200 transition 
      duration-500 ease-in-out
      transform
      opacity-0 scale-90
      animate-fadeInScale
      hover:scale-105"
      style={{ animationDelay: '500ms' }}
    >
      <strong>File Type:</strong> {file.type}
    </p>
         
        </div>
      )}
    </div>
  );
}

