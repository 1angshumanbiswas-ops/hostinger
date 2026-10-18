import { parseFile, extractKeywords } from './fileParser';

export const analyzeCV = async (file) => {
  try {
    // 1. Parse content
    const textContent = await parseFile(file);
    const textLower = textContent.toLowerCase();
    
    // 2. Define Analysis Criteria
    const requiredSections = [
      { id: 'experience', keywords: ['experience', 'employment', 'work history', 'professional background'] },
      { id: 'education', keywords: ['education', 'academic', 'qualifications', 'degrees'] },
      { id: 'skills', keywords: ['skills', 'technologies', 'competencies', 'expertise', 'stack'] },
      { id: 'contact', keywords: ['contact', 'email', 'phone', 'address', 'linkedin'] },
      { id: 'summary', keywords: ['summary', 'profile', 'objective', 'about'] }
    ];

    const criticalKeywords = ['leadership', 'management', 'development', 'analysis', 'project', 'team', 'communication'];

    // 3. Analyze Sections
    const foundSections = requiredSections.filter(section => 
      section.keywords.some(k => textLower.includes(k))
    );
    
    // 4. Analyze Formatting (Heuristics)
    const isPDF = file.type === 'application/pdf';
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const fileSizeMB = file.size / (1024 * 1024);
    
    // 5. Analyze Contact Info
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
    const hasEmail = emailRegex.test(textContent);
    const hasPhone = phoneRegex.test(textContent);
    
    // 6. Calculate Component Scores
    
    // Structure Score (20%)
    const structureScore = (foundSections.length / requiredSections.length) * 100;
    
    // Keywords Score (25%)
    const extractedFileKeywords = extractKeywords(textContent);
    // Simple heuristic: diversity of keywords and length of content
    const keywordDiversity = new Set(extractedFileKeywords).size;
    const keywordScore = Math.min(100, Math.max(20, (keywordDiversity / 50) * 100));

    // Formatting Score (20%)
    let formattingScore = 100;
    if (fileSizeMB > 2) formattingScore -= 20; // Too large
    if (!isPDF && !isDocx) formattingScore -= 50; // Wrong format
    // Heuristic: check for bullet points (often represented by specific chars in raw text or newlines)
    const hasBulletPoints = textContent.includes('•') || textContent.includes('- ') || textContent.includes('* ');
    if (!hasBulletPoints) formattingScore -= 20;

    // Contact Info Score (15%)
    let contactScore = 0;
    if (hasEmail) contactScore += 50;
    if (hasPhone) contactScore += 50;

    // Sections Consistency (20%) - simplified as same as structure for this engine, 
    // but practically could check for hierarchy
    const sectionsScore = structureScore; 

    // 7. Calculate Total Score
    const totalScore = Math.round(
      (keywordScore * 0.25) +
      (formattingScore * 0.20) +
      (structureScore * 0.20) +
      (contactScore * 0.15) +
      (sectionsScore * 0.20)
    );

    // 8. Generate Recommendations
    const recommendations = [];

    // Missing Sections
    const missingSections = requiredSections.filter(s => !foundSections.includes(s));
    missingSections.forEach(s => {
      recommendations.push({
        priority: 'High',
        category: 'Structure',
        text: `Missing "${s.id.charAt(0).toUpperCase() + s.id.slice(1)}" section. specific headers help ATS parse your resume correctly.`
      });
    });

    // Contact Info
    if (!hasEmail) {
      recommendations.push({ priority: 'High', category: 'Contact', text: 'No email address detected. This is critical for recruiters to reach you.' });
    }
    if (!hasPhone) {
      recommendations.push({ priority: 'Medium', category: 'Contact', text: 'No phone number detected. Consider adding one for direct communication.' });
    }

    // Formatting
    if (!hasBulletPoints) {
      recommendations.push({ priority: 'Medium', category: 'Formatting', text: 'Use bullet points to list responsibilities. Dense paragraphs are harder for both ATS and humans to read.' });
    }
    if (fileSizeMB > 2) {
      recommendations.push({ priority: 'Low', category: 'Formatting', text: `File size is ${fileSizeMB.toFixed(1)}MB. Try to keep it under 2MB for faster uploads and processing.` });
    }

    // Keywords
    if (keywordDiversity < 20) {
      recommendations.push({ priority: 'High', category: 'Keywords', text: 'Your resume seems short on distinct keywords. Elaborate on your skills and experiences using industry-standard terms.' });
    }

    return {
      score: totalScore,
      breakdown: {
        keywords: Math.round(keywordScore),
        formatting: Math.round(formattingScore),
        structure: Math.round(structureScore),
        contact: Math.round(contactScore),
        sections: Math.round(sectionsScore)
      },
      recommendations: recommendations.sort((a, b) => {
        const priorities = { High: 3, Medium: 2, Low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      }),
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB'
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze CV. Please ensure the file is not corrupted.");
  }
};