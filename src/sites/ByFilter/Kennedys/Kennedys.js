const { getCountryByDDD } = require("../../../utils/getNationality");
const ByFilterNP = require("../../../entities/BaseSites/ByFilterNP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Kennedys extends ByFilterNP {
  constructor(
    name = "Kennedys",
    link = "https://kennedyslaw.com/en/search/?q=&facet=6843&profileType=6723",
    totalPages = 1,
  ) {
    super(name, link, totalPages, 400);
    
    this._filterOptions = {
      "": "",
      "": "",
    };
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
    await super.accessPage(index);

    const countries = await driver
      .findElement(By.className("search-filters-section"))
      // .findElement(By.css("details:nth-child(8)"))

    await countries.click();
    const c = await countries
    .findElement(By.className("search-filters-item-nested-head"))
    await c.click();

    console.log(await countries.getAttribute("outerHTML"))

    const opts = await countries.findElements(By.className("search-details"));
    for (let i = 0; i < opts.length; i++) {
      await opts[i].click();
    }
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css(""))
      .getAttribute("href");

    await super.openNewTab(link);
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

module.exports = Kennedys;

async function main() {
  t = new Kennedys();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
