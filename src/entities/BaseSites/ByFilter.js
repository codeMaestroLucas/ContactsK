const Site = require("./Site");

var filterValues = [
    { country: "", value: "" },
    { country: "", value: "" },
    { country: "", value: "" },
    { country: "", value: "" },
    ];

class ByFilter extends Site {
  constructor(name, link, totalPages, maxLawyersForSite = 1) {

    super(name, link, totalPages, maxLawyersForSite);

    const sanitizedPath = name.trim().replace(/\s+/g, "");
    this.emailsOfMonthPath = `./src/entities/Sites/ByFilter/${ sanitizedPath }/${ sanitizedPath }.txt`;
    this.emailsToAvoidPath = `./src/entities/Sites/ByFilter/${ sanitizedPath }/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);

    this._currentPage = 0;
  }


  async accessPage() {
    const actualValue = filterValues[this._currentPage].value;
    const otherUrl = ``;
    await super.accessPage(this._currentPage, otherUrl);
    try {
    } catch (e) {}
  }

  async searchForLawyers() {
    let lawyersRegistered = 0;
    for (let i = 0; i < this._totalPages; i++) {
      console.log(`${ this._totalPages }) ${ i } - - - - Page ${ i + 1 }`);

      await this.accessPage();

      const lawyersInPage = await this.getLawyersInPage();

      if (!lawyersInPage || lawyersInPage.length <= 0) {
        console.log(
          `No search results found on page ${ i + 1 } of the firm ${ this._name }`
        );
        continue; // Skip this page
      }

      for (let [index, lawyer] of lawyersInPage.entries()) {
        try {
          const lawyerDetails = await this.getLawyer(lawyer);
          if (lawyerDetails === "Not Partner") {
            console.log("Not Partner");
            continue;
          }

          if (!lawyerDetails || !lawyerDetails.country || !lawyerDetails.email) {
            console.log(
              `Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nSkipping...`
            );
            console.log("  Name: " + lawyerDetails.name);
            console.log("  Email: " + lawyerDetails.email);
            console.log("  Country: " + lawyerDetails.country);
            continue;
          }

          const { name = "", country, email } = lawyerDetails;

          if (email && !name) {
            name = this.getNameFromEmail(email);
          }

          let canRegister = makeValidations(
            name, country, email,
            this._lastCountries,
            this.emailsOfMonthPath, this.emailsToAvoidPath
          );
          if (!canRegister) continue;

          await super().registerLawyer(
            name, country, email,
            this._name, this.emailsOfMonthPath
          );

          lawyersRegistered++;

          if (lawyersRegistered === this._maxLawyersForSite) {
            console.log(
              `No more than ${ this._maxLawyersForSite } lawyer need for the firm ${ this._name }.`
            );
            return;
          }

          this._currentPage++;


        } catch (e) {
          console.log(
            `Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nError: ${ e }...`
          );
          // throw e;
        }
      }
    }
  }
}

module.exports = ByFilter;
