// services/atsScorer.js
// Common ATS keywords for different industries
const COMMON_KEYWORDS = [
    'teamwork', 'leadership', 'communication', 'problem solving',
    'project management', 'analytical skills', 'technical skills',
    'Microsoft Office', 'Excel', 'Word', 'PowerPoint', 'Outlook',
    'Google Suite', 'CRM', 'ERP', 'JavaScript', 'Python', 'Java',
    'HTML', 'CSS', 'React', 'Node.js', 'SQL', 'database',
    'marketing', 'sales', 'customer service', 'budgeting',
    'financial analysis', 'reporting', 'strategic planning'
  ];
  
  // Common resume sections
  const REQUIRED_SECTIONS = [
    'experience', 'work history', 'employment',
    'education', 'skills', 'technical skills',
    'certifications', 'projects'
  ];
  
  export function analyzeResume(text) {
    const lowercaseText = text.toLowerCase();
    
    // Keyword analysis
    const foundKeywords = COMMON_KEYWORDS.filter(keyword => 
      lowercaseText.includes(keyword.toLowerCase())
    );
    const missingKeywords = COMMON_KEYWORDS.filter(keyword => 
      !lowercaseText.includes(keyword.toLowerCase())
    );
    
    // Section analysis
    const foundSections = REQUIRED_SECTIONS.filter(section =>
      lowercaseText.includes(section.toLowerCase())
    );
    const missingSections = REQUIRED_SECTIONS.filter(section =>
      !lowercaseText.includes(section.toLowerCase())
    );
    
    // Calculate score (0-100)
    const keywordScore = (foundKeywords.length / COMMON_KEYWORDS.length) * 50;
    const sectionScore = (foundSections.length / REQUIRED_SECTIONS.length) * 30;
    const formatScore = isResumeFormattedWell(text) ? 20 : 10;
    const totalScore = Math.min(Math.round(keywordScore + sectionScore + formatScore), 100);
    
    // Generate suggestions
    const suggestions = [];
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Add these relevant keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    if (missingSections.length > 0) {
      suggestions.push(`Include these sections: ${missingSections.join(', ')}`);
    }
    
    if (!hasBulletPoints(text)) {
      suggestions.push('Use bullet points for better readability');
    }
    
    if (hasLongParagraphs(text)) {
      suggestions.push('Break long paragraphs into smaller chunks');
    }
    
    return {
      score: totalScore,
      foundKeywords,
      missingKeywords,
      foundSections,
      missingSections,
      suggestions
    };
  }
  
  function isResumeFormattedWell(text) {
    // Simple checks for good formatting
    const lines = text.split('\n');
    const hasBullets = lines.some(line => line.trim().startsWith('•') || line.trim().match(/^\d\./));
    const hasShortLines = lines.some(line => line.trim().length > 0 && line.trim().length < 80);
    
    return hasBullets && hasShortLines;
  }
  
  function hasBulletPoints(text) {
    const lines = text.split('\n');
    return lines.some(line => line.trim().startsWith('•') || line.trim().match(/^\d\./));
  }
  
  function hasLongParagraphs(text) {
    const paragraphs = text.split('\n\n');
    return paragraphs.some(para => para.length > 300);
  }