const title = require('../utils/title');


/**
 * Class used to represent a Lawyer
 */
class Lawyer {
  /**
   * Constructor of the lawyer
   * @param {string} link
   * @param {string} name
   * @param {string} email
   * @param {string} phone
   * @param {string} firm
   * @param {string} country
   */
  constructor(link, name, email, phone = '', firm, country) {
    this._link = link.trim().toLowerCase();
    this._name = this.#treatLawyerName(name);
    this._email = this.#treatEmail(email);
    this._phone = this.#treatPhone(phone);
    this._firm = firm.trim();
    this._country = country;
  }

  get link() { return this._link; }
  get name() { return this._name; }
  get email() { return this._email; }
  get phone() { return this._phone; }
  get firm() { return this._firm; }
  get country() { return this._country; }


  /**
   * This function is used to treat a Lawyer name removing all the abreviations
   * and returning the name
   * @param {string} name
   * @returns {string} name treated
   */
  #treatLawyerName(name) {
    //TODO: Check the treat when accented words are present.
    // Normalize accents and remove diacritics -> to deal with accents words.
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Remove punctuation (.,) , quotes("') and convert name to lowercase
    name = name
      .replace(/\./g, " ")
      .replace(/,/g, " ")
      // .replace(/\*/g, " ")  //! To identify the GetNameByEmail function
      .replace(/\"/g, " ")
      .replace(/\'/g, " ")
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
   * Function used to treat a lawyer email.
   * @param {string} email
   * @returns {string} email treated
   */
  #treatEmail(email) {
    return email.toLowerCase().replace("mailto:", "")
                              .replace("mailto", "")
                              .trim();
  }
  

  /**
   * Functino used to treat a lawyer phone removing all the non numeric
   * characters and leading zeros.
   * @param {string} phone
   * @returns {string} phone treated
   */
  #treatPhone(phone) {
    return phone.replace(/\D/g, "").replace(/^0+/, "");
  }
}

module.exports = Lawyer;
