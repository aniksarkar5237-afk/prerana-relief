import Tesseract from 'tesseract.js';

export const extractTextFromBuffer = async (buffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    return text.toLowerCase();
  } catch (error) {
    console.error('OCR Extraction Error:', error);
    throw new Error('Failed to extract text from document');
  }
};

export const validateRegistrationDoc = async (buffer, expectedId) => {
  const extractedText = await extractTextFromBuffer(buffer);
  let matched = false;

  // Check expected ID
  if (expectedId) {
    const normalizedId = expectedId.replace(/[\s-]/g, '').toLowerCase();
    const normalizedText = extractedText.replace(/[\s-]/g, '');
    if (normalizedText.includes(normalizedId)) {
      matched = true;
    }
  }

  // Check common charity keywords if ID wasn't matched (or as an additional heuristic)
  if (!matched) {
    const keywords = ['registration', 'trust', 'darpan', 'section 8', 'society', 'ngo'];
    matched = keywords.some(keyword => extractedText.includes(keyword));
  }

  return { matched, extractedSnippet: extractedText.substring(0, 500) };
};
