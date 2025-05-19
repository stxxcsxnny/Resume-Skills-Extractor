import { useState, useEffect, createRef } from 'react';
import { checkBackendStatus } from '../services/api';
import{motion} from 'framer-motion';
import Header from '../components/header';


import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DropzoneUploader from '../components/DropZoneUploder';
import FilePreview from '../components/FilePreview';


export default function Home() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [showSkillsPage, setShowSkillsPage] = useState(false);
  

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await checkBackendStatus();
        setLoading(false);
      } catch (error) {
        setError('Backend is not available');
         setLoading(false);
      } finally {
        setLoading(false);
        
      }
    };

    checkStatus();
  })


const handleFileChange = (file) => {
  setSelectedFile(file);
  setError(null);
  setExtractedSkills([]);
};

  
const handleExtractSkills = () => {
  if (!selectedFile) {
    setError("Please select a file first.");
    return;
  }
  setLoading(true);
  setError(null);
  setExtractedSkills([]);
  setShowSkillsPage(false); // reset first

  const formData = new FormData();
  formData.append('file', selectedFile);

  fetch('http://127.0.0.1:8000/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to extract skills');
      const data = await res.json();
      if (data.skills) {
        setExtractedSkills(data.skills);
        setShowSkillsPage(true); // show mobile page
      } else if (data.error) {
        setError(data.error);
      }
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
};



 
 const handleCopySkills = () => {
    if (!extractedSkills) return;

    const allSkills = Object.values(extractedSkills)
      .flat()
      .filter(Boolean)
      .join(', '); // Or use '\n' for newline-separated

    navigator.clipboard.writeText(allSkills)
      .then(() => {
        alert("Skills copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    
    
    <>
      <Header/>
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center  w-full overflow-x-hidden">
<div className="flex flex-col sm:flex-col lg:flex-row justify-between space-x-5  lg:w-9/12 md:w-10/12 sm:w-10/12  mb-8">

 <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, type: "spring" }}
  className='bg-[#fef2f2] p-5 rounded-lg shadow-lg flex-1 h-96 mt-8 flex flex-col justify-center items-center'
>
  <FileCopyIcon style={{ width: '100px', height: '100px', color: '#040228' }} />
  <DropzoneUploader onFileAccepted={handleFileChange} />
</motion.div>

<motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
  className='bg-[#eff6ff] p-5 rounded-lg shadow-lg flex-1 h-96 mt-8 flex flex-col'
>
  <h1 className='text-xl font-bold text-left'>Preview</h1>
  {error && <p className="mt-1 text-red-600 font-medium">{error}</p>}
  {loading ? (
    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
  ) : (
    <FilePreview file={selectedFile} />
  )}
</motion.div>

</div>
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  className='bg-[#040228] text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-8 mb-4 w-96 h-12'
  onClick={handleExtractSkills}
  disabled={loading}
>
  {loading ? 'Extracting Skills...' : 'Extract Skills'}
</motion.button>

{/* Mobile Skills Page */}
{showSkillsPage && (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className='lg:hidden bg-[#eff6ff] p-4 rounded-lg shadow-lg w-11/12 h-[calc(100vh-100px)] y- mt-4 mb-4 flex-col overflow-y-auto absolute  top-6'
  >
    <div className="flex justify-between items-center mb-4">
      <p className='text-xl font-bold text-left'>Extracted Skills</p>
      <button
        onClick={() => setShowSkillsPage(false)}
        className='text-blue-800 font-semibold underline'
      >
        Back
      </button>
    </div>
    
    <div className='flex flex-wrap gap-2 px-2'>
      {extractedSkills && Object.entries(extractedSkills).map(([category, skills]) => (
        <div key={category} className="mb-4">
          <h2 className="text-lg font-semibold text-left text-sky-950 ml-4 mb-1">{category}</h2>
          <div className="flex flex-wrap gap-2 px-2">
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, index) => (
                <motion.div
                  key={`${category}-${skill}`}
                  initial={{ opacity: 0, scale: 0.8, y: -500 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.8, duration: 1, type: 'spring' }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 hover:scale-105"
                >
                  {skill}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic">No skills found</p>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className='flex justify-end items-center mt-4'>
      <button
        className='bg-transparent border border-slate-950 font-bold py-2 px-4 shadow-md rounded-lg w-40 h-12'
        onClick={handleCopySkills}
      >
        Copy
      </button>
    </div>
  </motion.div>
)}

        


<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.7 }}
  className='hidden lg:block bg-[#eff6ff] p-4 rounded-lg shadow-lg w-9/12 h-80 mt-8 mb-4 flex-col overflow-y-auto'
>
  <p className='text-xl font-bold mb-4 text-left'>Extracted Skills</p>
  
  <div className='flex flex-wrap gap-2 px-2'>
{extractedSkills && Object.entries(extractedSkills).map(([category, skills]) => (
  <div key={category} className="mb-4">
    <h2 className="text-lg font-semibold text-left text-sky-950 ml-4 mb-1">{category}</h2>
    <div className="flex flex-wrap gap-2 px-2">
      {Array.isArray(skills) && skills.length > 0 ? (
        skills.map((skill, index) => (
          <motion.div
            key={`${category}-${skill}`}
            initial={{ opacity: 0, scale: 0.8 ,y: -500 }}
            animate={{ opacity: 1, scale: 1 ,y: 0 }}
            transition={{ delay: index * 0.8, duration: 1, type: 'spring' }}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 hover:scale-105"
          >
            {skill}
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500 italic">No skills found</p>
      )}
    </div>
  </div>
))}
          </div>
          <div className='flex justify-end items-center mt-4'>
              <button className='bg-transparent border border-slate-950   font-bold py-2 px-4 shadow-md rounded-lg mt-10  w-40 h-12 self-end ' onClick={handleCopySkills}>
           Copy
          </button>
        </div>
</motion.div>


          
    </div>
    
    

    </>
  );
} 