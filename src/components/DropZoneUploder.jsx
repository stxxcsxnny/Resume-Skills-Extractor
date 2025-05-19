import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropzoneUploader({ onFileAccepted }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      // optionally handle rejections
      return;
    }

    const file = acceptedFiles[0];
    if (file && onFileAccepted) {
      onFileAccepted(file); // ✅ directly pass the File object
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10* 1024 * 1024,
    accept: {
      'application/pdf': [],
      'application/msword': [],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
        'application/docx': [],
      
    },
  });

  return (
    <div {...getRootProps()} className="p-6 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
      <input {...getInputProps()} />
      {isDragActive
        ? <p className="text-blue-500">Drop the file here...</p>
        : <p className="text-gray-600">Slide That Resume Over—Let’s Extract the Magic!</p>}
    </div>
  );
}
