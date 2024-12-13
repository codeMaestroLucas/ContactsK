const title = require('../utils/title');

class Lawyer {
  constructor(name, country, email) {
    this._name = this.#treatLawyerName(name);
    this._country = country;
    this._email = email;
  }

  get name() { return this._name }
  get country() { return this._country }
  get email() { return this._email }

  /**
   * This function is used to treat a Lawyer name removing all the abreviations
   * and returning the name
   * @param {string} name treated
   */
  #treatLawyerName(name) {
    // Remove punctuation (.,) , (*) and convert name to lowercase
    name = name
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/\*/g, "")
      .toLowerCase();
  
    const abbreviations = [
      "mr", "ms", "mx", "dr", "prof", "mrs", "miss",
      "master", "sir", "esq", "rev", "att", "llm", "kc",
      "managing", "partner"
    ];
  
    // Split name into words and filter out abbreviations
    const words = name.split(' ').filter(word => word.trim() && !abbreviations.includes(word));
  
    const fullName = words.join(" ");
  
    return title(fullName.trim());
  }
  
  
  
/**
 * Extracts the first name from a full name string, accounting for potential abbreviations.
 * If the first word of the name is an abbreviation (e.g., Mr., Ms., Dr.), it returns the second word as the first name.
 * @param {string} name - A full name string (first name, last name, and possibly a title).
 * @returns {string} The first name, which may be the second word if the first word is an abbreviation.
 */
#getFirstName(name) {
  const splitName = name.split(' ').filter(Boolean); // Split and remove empty strings;
  let nameToReturn = splitName[0];

  if (nameToReturn.length < 2) nameToReturn = splitName[1];

  return nameToReturn
}

  /**
   * Function used to return the treated data from the laywer class
   * @param {str} firmName of the lawter
   * @returns {promisse} data treated
   */
  returnTreatData(firmName) {
    return {
      firstName: this.#getFirstName(this.name),
      nameTreated: this.name,
      firmNameTreated: firmName.trim(),
      countryTreated: this.country,
      emailTreated: this.email
    };
  }
}

module.exports = Lawyer;
