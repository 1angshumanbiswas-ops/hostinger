/**
 * UUID Validation Utility
 * Validates UUID format and provides user-friendly error messages
 */

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Check if a value is a valid UUID v4 format
 * @param {string} value - The value to validate
 * @returns {boolean} - True if valid UUID, false otherwise
 */
export function isValidUUID(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return UUID_V4_REGEX.test(value);
}

/**
 * Validate user ID and log detailed error if invalid
 * @param {string} userId - The user ID to validate
 * @param {string} context - Context string for error logging (e.g., 'fetchContacts')
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateUserID(userId, context = 'Unknown') {
  if (!userId) {
    console.error(`[UUID Validator - ${context}] User ID is null or undefined`);
    return false;
  }

  if (typeof userId !== 'string') {
    console.error(`[UUID Validator - ${context}] User ID is not a string:`, typeof userId);
    return false;
  }

  if (!isValidUUID(userId)) {
    console.error(`[UUID Validator - ${context}] Invalid UUID format:`, userId);
    return false;
  }

  return true;
}

/**
 * Get a safe user ID (returns null if invalid)
 * @param {any} userId - The user ID to sanitize
 * @returns {string|null} - Valid UUID or null
 */
export function getSafeUserID(userId) {
  return isValidUUID(userId) ? userId : null;
}