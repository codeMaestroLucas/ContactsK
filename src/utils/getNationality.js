const path = require("path");
const fs = require("fs");

/**
 * Function used to search in the JSON based on the Country sent
 * @param {str} country to be searched in the JSON file.
 * @returns the Nationality of the country
 */
function getNationality(country) {
  if (!country) return "";

  const filePath = path.join(__dirname, "..", "baseFiles", "json", "countries.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const countries = JSON.parse(data);

    const countryData = countries.find(
      (c) => c.Country.toLowerCase() === country.toLowerCase()
    );
    return countryData ? countryData.Nationality : "Not Found";
  } catch (err) {
    console.error("Error reading country data:", err);
    return "Not Found";
  }
}


/**
 * Removes all the leading zeros of a number
 * @param {number} DDD
 *
 * E.G.:
 * getCountryByDDD("00123");  // OutPut: 123
 * getCountryByDDD("37052");  // OutPut: 30752
 */
function removeLeadingZeros(number) {
  return number.replace(/^0+/, "");
}


/**
 * Function used to search for a country based on the DDD code.
 * @param {str} ddd - The DDD code of the country.
 * @returns {*} containing the Country or null if not found.
 */
function getCountryByDDD(ddd) {
  if (!ddd) return "Not Found";

  // Remove non-numeric characters and leading zeros
  ddd = removeLeadingZeros(ddd.replace(/\D/g, ""));

  const filePath = path.join(__dirname, "..", "baseFiles", "json", "countries.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const countries = JSON.parse(data);

    for (let country of countries) {
      if (Array.isArray(country.DDD)) {
        // Iterate through each possible DDD in the array
        for (let possibleDDD of country.DDD) {
          if (isMatchingDDD(ddd, possibleDDD)) {
            return country.Country;
          }
        }
      } else {
        // Handle single DDD value for backward compatibility
        if (isMatchingDDD(ddd, country.DDD)) {
          return country.Country;
        }
      }
    }

    console.log("Couldn't find the country with the Number: " + ddd);
    return "Not Found";
  } catch (err) {
    console.error("Error reading country data:", err);
    return "Not Found";
  }
}

/**
 * Helper function to match DDD codes, including ranges (e.g., "1-205").
 * @param {str} ddd - The input DDD to check.
 * @param {str} possibleDDD - The possible DDD value, which can be a single code
 * or a range (e.g., "1-205").
 * @returns {boolean} True if the input DDD matches the possible DDD or range.
 */
function isMatchingDDD(ddd, possibleDDD) {
  // To deal with the USA, Canada & Cayman Islands
  if (possibleDDD.includes("-")) {
    const [prefix, code] = possibleDDD.split("-");
    const prefixLength = prefix.length;
    const dddPrefix = ddd.substring(0, prefixLength);
    const dddCode = ddd.substring(prefixLength);

    return dddPrefix === prefix && dddCode.startsWith(code);
  }

  // Default exact match for single DDD
  return ddd.slice(0, possibleDDD.length).startsWith(possibleDDD);

}

module.exports = { getNationality, getCountryByDDD };
