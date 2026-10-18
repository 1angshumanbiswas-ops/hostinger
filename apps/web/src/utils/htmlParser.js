/**
 * Utility function to strip HTML tags from a string and return clean text.
 * @param {string} html - The HTML string to parse
 * @returns {string} - The cleaned text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};