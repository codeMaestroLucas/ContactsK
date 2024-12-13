/**
 * @param {str} str to convert to a Titled String
 * @returns titled string
 */
function title(str) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase() // Convert the whole string to lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}

module.exports = title;
