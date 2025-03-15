const ensureFileExists = require("../../../utils/ensureFileExists");
const makeValidations = require("../../../utils/makeValidations");
let { driver } = require("../../../config/driverConfig");
const ByFilterNP = require("../../../entities/BaseSites/ByFilterNP");
const Lawyer = require("../../../entities/Lawyer");


class AsiaLawBase extends ByFilterNP {
  constructor(
    name = "AsiaLaw",
    link = "https://www.example.com/",
    totalPages = 100,
  ) {
    super(name, link, totalPages);
    
    this.emailsOfMonthPath = `./src/sites/Specials/AsiaLaw/AsiaLaw.txt`;
    this.emailsToAvoidPath = `./src/sites/Specials/AsiaLaw/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);

    this._filterOptions = {
      "Hong-Kong-SAR/Rankings/320#lawyers": "Hong Kong",
      "China/Rankings/273#lawyers": "China",
      "Japan/Rankings/333#lawyers": "Japan",
      "Kazakhstan/Rankings/336#lawyers": "Kazakhstan",
      "Macao-SAR/Rankings/350#lawyers": "Macao",
      "Mongolia/Rankings/366#lawyers": "Mongolia",
      "South-Korea/Rankings/416#lawyers": "Korea (South)",
      "Taiwan/Rankings/432#lawyers": "Taiwan",
      "India/Rankings/323#lawyers": "India",
      "Maldives/Rankings/355#lawyers": "Maldives",
      "Sri-Lanka/Rankings/418#lawyers": "Sri Lank",
      "Brunei/Rankings/260#lawyers": "Brunei",
      "Cambodia/Rankings/265#lawyers": "Cambodia",
      "Indonesia/Rankings/324#lawyers": "Indonesia",
      "Laos/Rankings/341#lawyers": "Laos",
      "Malaysia/Rankings/354#lawyers": "Malaysia",
      "Philippines/Rankings/392#lawyers": "Philippines",
      "Singapore/Rankings/410#lawyers": "Singapore",
      "Thailand/Rankings/435#lawyers": "Thailand",
      "Vietnam/Rankings/455#lawyers": "Vietnam"
    };
    
    this._totalPages = new Set(Object.values(this._filterOptions)).size;

    this._otherLink = "";
    this._realCountry = "";
  }


  async searchForLawyers() {
    for (let i = 0; i < this._totalPages; i++) {
      console.log(`Page ${ i + 1 } - - - - - - - - - - ( ${ this._totalPages } )`);

      await this.accessPage(i);

      const lawyersInPage = await this.getLawyersInPage();

      if (!lawyersInPage || lawyersInPage.length <= 0) {
        console.log(
          `No search results found on page ${ i + 1 } of the firm ${ this._name }`
        );
        continue; // Skip this page
      }

      for (let [index, lawyer] of lawyersInPage.entries()) {
        try {
          await this.openNewTab(lawyer);
          // const windows = await driver.getAllWindowHandles();
          // if (windows.length < 2) continue ;

        try {
            
            const lawyerDetails = await this.getLawyer();
            if (lawyerDetails === "Not Partner") {
              console.log("Not Partner");
              continue;
            }
        
            if (!lawyerDetails || !lawyerDetails.link || !lawyerDetails.email) {
              console.log(
                `Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nSkipping...`
              );
              console.log("  Link: " + lawyerDetails.link);
              console.log("  Name: " + lawyerDetails.name);
              console.log("  Email: " + lawyerDetails.email);
              console.log("  Phone: " + lawyerDetails.phone);
              console.log("  Country: " + lawyerDetails.country);
              continue;
            }
  
          } catch (error) {
            // Some lawyers doesnt have the right information -
            // missing email, firmname and so on
            continue;
          }

          let { link, name = "", email, phone, country } = lawyerDetails;

          if (email && !name) {
            name = this.getNameFromEmail(email);
          }

          const lawyerToRegister = new Lawyer(link, name, email, phone, this._name, country);

          let canRegister = makeValidations(
            lawyerToRegister,
            this._lastCountries,
            this.emailsOfMonthPath, this.emailsToAvoidPath
          );
          if (!canRegister) continue;

          this.registerLawyer(lawyerToRegister, this.emailsOfMonthPath);


          if (this._lawyersRegistered === this._maxLawyersForSite) {
            console.log(`No more than ${ this._maxLawyersForSite } lawyer need for the firm ${ this._name }.`);
            return;
          }
          
        } catch (e) {
          console.log(`Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }\nError: ${ e }...`);
          continue;
          throw e;

        } finally {
          const windows = await driver.getAllWindowHandles();
          if (windows.length > 1) await this.closeTab();
        }
      }
    }
  }
}

module.exports = AsiaLawBase;
