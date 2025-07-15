const AsiaLawBase = require("./AsiaLawBase");
const { driver } = require("../../../config/driverConfig")

const { until, By } = require("selenium-webdriver");

class AsiaLaw extends AsiaLawBase {

  // TODO: Isnt swticthing country, and couldn find the <a> tag on lawyers
  
  /**
   * @returns {boolean} true for SKIP the country and false to search in the contry
   */
  selectRandomCountry() {
    const { randomLink, selectedCountry } = super.selectRandomCountry();
    if (selectedCountry === "No more countries to search.") {
      return true;
    }

    // Get the link based in the CurrentCountry
    this._otherLink = Object.keys(this._filterOptions).find(
      key => this._filterOptions[key] === this._currentCountry
    );
    return false;
  }


  async accessPage(index) {
    if (index === 0) this.selectRandomCountry();
    const otherUrl = `https://www.asialaw.com/Jurisdiction/${ this._otherLink }`;
    await super.accessPage(index + 1, otherUrl);
    try {} catch (e) {}

  }


  async getLawyersInPage() {
    await driver.wait(
      until.elementLocated(By.className("lawyersList")), 100000
    )

    return await driver
      .findElement(By.className("lawyersList"))
      .findElements(By.className("col-md-12"))
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getPosition() {
    const rows = await driver
      .findElement(By.className("col-xs-6 col-md-5 form-horizontal"))
      .findElements(By.css(".form-group.row"));

    for (let row of rows) {
      const label = await row.findElement(By.css("label"));
      const text = await label.getText();
      if (text.toLocaleLowerCase().trim() === "position:") {
        return await row
          .findElement(By.className("col-xs-8 > form-control-static"))
          .getText();
      }
    }
  }


  async #getFirmName() {
    return await driver
      .findElement(By.className("companyName equalized"))
      .findElement(By.css("h5"))
      .getText();
  }


  async #getName() {
    return await driver
      .findElement(By.className("companyName equalized"))
      .findElement(By.id("lawyerName"))
      .getText();
  }


  async #getEmail() {}




  async getLawyer(lawyer) {
    const position = await this.#getPosition();
    if (position.toLocaleLowerCase().trim() !== "partner") {
      return "Not Partner";
    }

    return {
      firmName: await this.#getFirmName(),
      name: await this.#getName(),
      email: email,
      country: this._currentCountry
    };
  }


  registerLawyer() {
    //todo: continue here
  }

}

module.exports = AsiaLaw;

async function main() {
  t = new AsiaLaw();
  // t.accessPage(0);
  t.searchForLawyers();
}

main();
