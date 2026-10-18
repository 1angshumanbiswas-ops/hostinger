import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseFile = async (file) => {
  const fileType = file.type;
  
  try {
    if (fileType === 'application/pdf') {
      return await parsePDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileType === 'application/msword'
    ) {
      return await parseDocx(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOCX.');
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw error;
  }
};

const parsePDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + ' ';
  }

  return fullText.trim();
};

const parseDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
};

export const extractKeywords = (text) => {
  // Simple keyword extraction based on frequency and length
  // In a real app, this would use NLP or a dictionary
  if (!text) return [];
  
  const stopwords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as', 'that', 'this', 'these', 'those', 'it', 'they', 'we', 'you', 'he', 'she', 'his', 'her', 'their', 'my', 'your', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'experience', 'year', 'years', 'work', 'job', 'responsible', 'duties', 'include', 'including']);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word));
    
  return [...new Set(words)]; // Unique keywords
};