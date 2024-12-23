const { getCountryByDDD } = require("../../../utils/getNationality");
const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


class Template extends ByFilterP {
  constructor(
    name = "Template",
    link = "https://www.example.com/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
    
    this._filterOptions = {
      "": "",
      "": "",
    };

    // this._totalPages = new Set(Object.values(this._filterOptions)).size;
  }


  /**
   * @returns {boolean} true for SKIP the country and false to search in the contry
   */
  #selectRandomCountry() {
    const { randomCity, selectedCountry } = super.selectRandomCountry();
    if (selectedCountry === "No more countries to search.") {
      return true;
    }


    return true;
  }
  
  
  /**
   * 
   */

  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    return lawyers;
  }


  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className(""))
      .getAttribute("href");


    return emailElement
  }

  
  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className(""))
      .getAttribute("href");
      
    return dddElement
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = Template;

async function main() {
  t = new Template();
  // t.accessPage(0);
  t.searchForLawyers();
}

main();
