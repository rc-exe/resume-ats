import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ScoreDisplay from './components/ScoreDisplay';
import Suggestions from './components/Suggestions';
import KeywordAnalysis from './components/KeywordAnalysis';
import * as pdfjsLib from 'pdfjs-dist';
import './styles.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const extractTextFromPdf = async (file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);
      try {
        const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
        let text = '';
        for (let i = 0; i < pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i + 1);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
        resolve(text);
      } catch (error) {
        reject('Error extracting PDF text: ' + error);
      }
    };
    reader.onerror = () => reject('Error reading file');
    reader.readAsArrayBuffer(file);
  });
};

const analyzeResume = (text, jobRole, experienceLevel) => {
  // Base score for having a properly formatted resume
  let baseScore = 30;
  
  // Define keywords for different roles
  const roleKeywords = {
    'Software Developer': ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Git', 'REST API'],
    'Data Scientist': ['Python', 'R', 'Machine Learning', 'Data Analysis', 'SQL', 'Pandas', 'NumPy'],
    'Product Manager': ['Agile', 'Scrum', 'Product Strategy', 'Market Research', 'Roadmap', 'JIRA', 'User Stories'],
    'Graphic Designer': ['Photoshop', 'Illustrator', 'UI/UX', 'Creative Suite', 'Design', 'Typography', 'Color Theory']
  };

  // Define experience-specific keywords
  const experienceKeywords = {
    'Entry-level': ['Internship', 'Junior', 'Beginner', 'Learning', 'Entry-level'],
    'Mid-level': ['Project Management', 'Team Collaboration', 'Problem-solving', '2-5 years', 'Intermediate'],
    'Senior-level': ['Leadership', 'Mentoring', 'Strategic Planning', 'Senior', '10+ years']
  };

  // Combine role and experience keywords
  const keywords = [
    ...roleKeywords[jobRole],
    ...experienceKeywords[experienceLevel]
  ];

  // Check for required sections (adds to base score)
  const requiredSections = ['experience', 'education', 'skills'];
  const lowercaseText = text.toLowerCase();
  const foundSections = requiredSections.filter(section => 
    lowercaseText.includes(section)
  );
  
  // Add 5 points for each found section
  baseScore += foundSections.length * 5;

  // Find matched keywords
  const matchedKeywords = keywords.filter(keyword =>
    lowercaseText.includes(keyword.toLowerCase())
  );

  // Generate suggestions for missing keywords
  const missingKeywords = keywords.filter(keyword => 
    !matchedKeywords.includes(keyword)
  );
  
  const suggestions = [
    ...missingKeywords.map(keyword => `Consider adding the keyword: ${keyword}`),
    ...(foundSections.length < requiredSections.length ? 
      [`Add missing sections: ${requiredSections.filter(s => !foundSections.includes(s)).join(', ')}`] : 
      [])
  ];

  // Calculate score (deduct 2 points for each missing keyword)
  const keywordDeduction = missingKeywords.length * 1;
  const finalScore = Math.max(0, baseScore - keywordDeduction + 
    (matchedKeywords.length / keywords.length) * 50);

  return {
    score: Math.min(Math.round(finalScore), 100), // Cap at 100
    suggestions,
    totalKeywords: keywords.length,
    matchedKeywords,
    missingKeywords,
    foundSections,
    missingSections: requiredSections.filter(s => !foundSections.includes(s))
  };
};

function App() {
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState({ 
    score: 0, 
    suggestions: [], 
    totalKeywords: 0,
    matchedKeywords: [],
    missingKeywords: [],
    foundSections: [],
    missingSections: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [jobRole, setJobRole] = useState('Software Developer');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level');

  const resetState = () => {
    setScore(null);
    setAnalysis({ 
      score: 0, 
      suggestions: [], 
      totalKeywords: 0,
      matchedKeywords: [],
      missingKeywords: [],
      foundSections: [],
      missingSections: []
    });
  };

  const handleJobRoleChange = (e) => {
    setJobRole(e.target.value);
    resetState();
  };

  const handleExperienceLevelChange = (e) => {
    setExperienceLevel(e.target.value);
    resetState();
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      const analysisResult = analyzeResume(text, jobRole, experienceLevel);
      setAnalysis(analysisResult);
      setScore(analysisResult.score);
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Resume ATS Scorer</h1>
      <p>Upload your resume to see how well it performs with Applicant Tracking Systems</p>

      <div className="job-role">
        <label htmlFor="job-role">Select Job Role: </label>
        <select id="job-role" value={jobRole} onChange={handleJobRoleChange}>
          <option value="Software Developer">Software Developer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Graphic Designer">Graphic Designer</option>
        </select>
      </div>

      <div className="experience-level">
        <label htmlFor="experience-level">Select Experience Level: </label>
        <select id="experience-level" value={experienceLevel} onChange={handleExperienceLevelChange}>
          <option value="Entry-level">Entry-level</option>
          <option value="Mid-level">Mid-level</option>
          <option value="Senior-level">Senior-level</option>
        </select>
      </div>

      <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

      {isLoading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analyzing your resume...</p>
        </div>
      )}
<div className="how-it-works">
  <h2>How it Works</h2>
  <p>
    This application helps you analyze the compatibility of your resume with 
    Applicant Tracking Systems (ATS). By uploading your resume (PDF format), 
    the app will:
  </p>
  <ul>
    <li><strong>Extract content</strong> from your resume.</li>
    <li><strong>Identify important keywords</strong> related to your desired job role and experience level.</li>
    <li><strong>Calculate a score</strong> based on the presence of keywords, relevant sections, and overall format.</li>
    <li><strong>Provide suggestions</strong> to improve your resume for better ATS compatibility.</li>
  </ul>
  <p>Get feedback to optimize your resume and increase your chances of passing through ATS filters.</p>
</div>

      {score !== null && (
        <>
          <ScoreDisplay score={score} />
          <KeywordAnalysis
            foundKeywords={analysis.matchedKeywords}
            missingKeywords={analysis.missingKeywords}
            foundSections={analysis.foundSections}
            missingSections={analysis.missingSections}
          />
          <Suggestions suggestions={analysis.suggestions} />
        </>
      )}
    </div>
  );
}

export default App;