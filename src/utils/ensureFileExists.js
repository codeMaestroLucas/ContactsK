const fs = require("fs");

/**
 * Ensures that a file exists by creating it if it doesn't.
 * Removes spaces from the file path for consistency.
 *
 * @param {string} filePath - Path of the file to check or create.
 */
function ensureFileExists(filePath) {
  // Check if filePath is a string
  if (typeof filePath !== 'string') {
    throw new Error('The filePath must be a string');
  }

  // Ensure filePath is not empty
  if (!filePath) {
    throw new Error('The filePath cannot be an empty string');
  }

  const dir = filePath.substring(0, filePath.lastIndexOf("/"));

  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8");
  }
}

module.exports = ensureFileExists;
