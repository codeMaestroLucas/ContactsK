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


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className(""))
  }


  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.className())
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
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
