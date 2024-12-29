const { getCountryByDDD } = require("../../../utils/getNationality");
const ByFilterNP = require("../../../entities/BaseSites/ByFilterNP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Kennedys extends ByFilterNP {
  constructor(
    name = "Kennedys",
    link = "https://kennedyslaw.com/en/search/?q=&facet=6843&profileType=6723",
    totalPages = 27,
  ) {
    super(name, link, totalPages);
    
    this._filterOptions = {
      "": ""
    };
  }


  /**
   * @returns {boolean} true for SKIP the country and false to search in the contry
   */
  selectRandomCountry() {
    return false;
  }


  async #clickOnCountries() {
    const countries = await driver.wait(
      until.elementLocated(By.xpath(`//*[@id="__layout"]/div/main/section/div[2]/section/div/aside/div/details[8]`)
      ), 100000
    );
    
    await countries.click();

    const opts = await countries.findElements(By.className("search-details"));
    for (let i = 0; i < opts.length - 1; i++) {
      await opts[i]
        .findElement(By.css("label"))
        .click();
      await new Promise(resolve => setTimeout(resolve, 1500));
      // If i click before the search will be skipped
    }
  }
  

  async #clickOnNextPage() {
    const pagination = await driver.findElement(By.className("kenn-paginate"));
    await pagination.findElement(By.css("li:last-child")).click();
  }
  

  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);
    
      await driver
        .findElement(By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"))
        .click();
    
      await this.#clickOnCountries();

    } else {
      await this.#clickOnNextPage();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("search-result people")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }
  

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElements(By.className('person-link'));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.className("person-card")
      ), 5000
    );

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = Kennedys;
