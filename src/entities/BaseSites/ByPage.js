const ensureFileExists = require("../../utils/ensureFileExists");
const makeValidations = require("../../utils/makeValidations");
const Site = require("./Site")


class ByPage extends Site {
  constructor(name, link, totalPages, maxLawyersForSite) {

    super(name, link, totalPages, maxLawyersForSite);

    const sanitizedPath = name.trim().replace(/\s+/g, "");
    this.emailsOfMonthPath = `./src/sites/ByPage/${ sanitizedPath }/${ sanitizedPath }.txt`;
    this.emailsToAvoidPath = `./src/sites/ByPage/${ sanitizedPath }/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);
  }
  

  async searchForLawyers() {
    const searchGenerator = super.searchForLawyers();
  
    while (true) {
      // INDIVIDUAL LAWYER
      const { value: lawyer, done } = await searchGenerator.next();
      if (done) break; // Exit if the generator is complete
  
      // VALIDATION Yield
      const lawyerDetails = await this.getLawyer(lawyer);
      const isPartner = lawyerDetails !== "Not Partner";
  
      await searchGenerator.next({
        isPartner,
        lawyerDetails,
      });
  
      // // AFTER REGISTRATION Yield
      // await searchGenerator.next();
      // // FINALLY Yield
      // await searchGenerator.next();
    }
  }
  
}

module.exports = ByPage;
