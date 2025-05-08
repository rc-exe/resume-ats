import React, { useRef } from 'react';

function FileUpload({ onFileUpload, isLoading }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
      fileInputRef.current.value = ''; // Reset file input after upload
    } else {
      alert('Please upload a PDF file.');
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        id="resume-upload"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isLoading}
        ref={fileInputRef} // Ref to reset the input
      />
      <label htmlFor="resume-upload">
        {isLoading ? 'Processing...' : 'Upload PDF Resume'}
      </label>
    </div>
  );
}

export default FileUpload;
