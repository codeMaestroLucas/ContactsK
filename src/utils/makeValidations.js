const { getRegisteredEmailOfMonth } = require("./emailsOfTheMonth");
const Contacts = require("../entities/Excel/Contacts");
const Lawyer = require("../entities/Lawyer");

const path = require("path");
const fs = require("fs");


/**
 * @param {string} country to be searched
 * @returns {bool} true if is a country to avoid, else false
 */
function isACountryToAvoid(country) {
    const filePath = path
      .join(__dirname, "..", "baseFiles", "json", "countriesToAvoid.json"
    );
  
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const countriesToAvoid = JSON.parse(data);
  
      const countryData = countriesToAvoid.find(
        (c) => c.Country.toLowerCase() === country.toLowerCase()
      );
  
      return countryData ? true : false;
  
    } catch (err) {
      console.error("Error reading country data:", err);
      return false;
    }
}


/**
 * Function used to check if the email was already registered in the contacts
 * @param {string} email to verify
 * @returns {boolean} - returns true if the email is found in the contacts.xlsx
 * or for the current month. If doesn't returns false
 */
function emailAlreadyRegistered(email, emailsOfMonthPath) {
  const contacts = new Contacts();

  // Check in the file for the current month
  let emailRegisteredThisMonth = getRegisteredEmailOfMonth(email, emailsOfMonthPath);
  if (emailRegisteredThisMonth) return true;

  // Check in contacts.xlsx
  let emailRegisteredInContacts = contacts.emailInContacts(email);
  if (emailRegisteredInContacts) return true;

  return false;
}


/**
 * The emails in this file.txt are from eldest lawyers, post morthers and others
 * @param {string} email to be searched and already treated
 * @param {string} path to the file with the emails to avoid
 * @returns true if email is in the file, false otherwise
 */
function isAEmailToAvoid(email, emailsToAvoidPath) {

  try {
    const fileContent = fs.readFileSync(emailsToAvoidPath, "utf8");
    return fileContent.includes(email);

  } catch (err) {
    console.error("Error reading file", err);
    return false;
  }
}


/**
 * Function used to validate if the operation of register a lawter can proceed
 * @param {Lawyer} lawyer to be validated
 * @param {set} setOfLastCountries validated
 * @returns {bool} true if can continue else false
 */
function makeValidations(lawyer, setOfLastCountries, emailsOfMonthPath, emailsToAvoidPath) {
  if (!lawyer.name || !lawyer.email) {
    // The country is easiest to search for
    console.log("Incomplete lawyer data, skipping...\n");
    return false;
  }

  const { email, country } = lawyer;
  
  if (country) {
    let countryToAvoid = isACountryToAvoid(country);
    if (countryToAvoid) {
      console.log(`Country to avoid: ${ countryToAvoid } - ${ country }`);
      return false;
    };
  }

  
  const emailToAvoid = isAEmailToAvoid(email, emailsToAvoidPath);
  if (emailToAvoid) {
    console.log(`Email to avoid: ${ emailToAvoid }`);
    return false;
  }


  const emailRegitred = emailAlreadyRegistered(email, emailsOfMonthPath);
  if (emailRegitred) {
    // console.log(`Email already registered: ${email}`);
    return false;
  }


  // Country already processed -> can't have the same country twice in one firm
  if (setOfLastCountries.has(country)) {
    console.log(`${ country } already processed in this firm`);
    return false;
  }

  return true;
}

module.exports = makeValidations;
