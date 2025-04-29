const { getFormattedPhone } = require("../utils/getNationality");

/**
 * Class used to represent a Lawyer
 */
class Lawyer {
  /**
   * Constructor of the lawyer
   * @param {string} name
   * @param {string} email
   * @param {string} firm
   * @param {string} country
   */
  constructor(name, email, firm, country) {
    this._name    = this.#treatLawyerName(name);
    this._email   = this.#treatEmail(email);
    this._firm    = firm.trim();
    this._country = country
  }

  get name()    { return this._name; }
  get email()   { return this._email; }
  get firm()    { return this._firm; }
  get country() { return this._country; }


  /**
   * This function is used to treat a Lawyer name removing all the abreviations
   * and returning the name
   * @param {string} name
   * @returns {string} name treated
   */
  #treatLawyerName(name) {
    // Remove punctuation (.,) , quotes("') and convert name to lowercase
    name = name
      .replace("\n", " ")
      .replace(/[.,]/g, " ")
      .replace(/["']/g, " ")
      // .replace(/\*/g, " ")  //! To identify the GetNameByEmail function
      .toLowerCase();

    name = name.replace("partner", "")
               .replace("managing", "")
               .replace("senior", "")
  
    const abbreviations = [
      "mr", "ms", "mx", "dr", "prof", "mrs", "miss",
      "master", "sir", "esq", "rev", "att", "llm", "kc",
    ];
  
    // Split name into words and filter out abbreviations
    const words = name.split(' ').filter(word => word.trim() && !abbreviations.includes(word));
  
    const fullName = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  
    return fullName.trim();
  }


  /**
   * Function used to treat a lawyer email.
   * @param {string} email
   * @returns {string} email treated
   */
  #treatEmail(email) {
    return email.toLowerCase().replace("mailto:", "")
                              .replace("mailto", "")
                              .trim();
  }

}

module.exports = Lawyer;
