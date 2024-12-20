const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MorganLewisAndBockiusLLP extends ByFilterP {
  constructor(
    name = "Morgan Lewis And Bockius LLP",
    link = "https://www.morganlewis.com/our-people",
    totalPages = 14,
  ) {

    super(name, link, totalPages, 500);

    this._filterOptions = {
      "Abu Dhabi": "the UAE",    "Almaty":    "Kazakhstan",   "Astana":   "Kazakhstan",
      "Beijing":   "China",      "Brussels":  "Belgium",      "Dubai":    "the UAE",
      "Frankfurt": "Germany",    "Hong Kong": "China",        "London":   "England",
      "Munich":    "Germany",    "Paris":     "France",       "Shanghai": "China",
      "Singapore": "Singapore",  "Tokyo":     "Japan"
    };

    this._currentCountry = ""
    this._totalPages = new Set(Object.values(this._filterOptions)).size;
  }

  async #clickPartnerOpt() {
    const roleOpt = await driver.wait(
      until.elementLocated(By.className("c-es__show-more-people")
      ), 10000
    );
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", roleOpt);
    await driver.executeScript("arguments[0].click();", roleOpt);
  
    const positionOpt = await driver
      .findElement(By.id('ulpositionInputPeople'))
      .findElement(By.className('stylish-select-left'))
      .findElement(By.className('stylish-select-right styledSelect'));
  
    await driver.executeScript("arguments[0].click();", positionOpt);
  
    const ulElement = await driver.findElement(By.css('ul.listing'));

    // Force display of the dropdown
    await driver.executeScript("arguments[0].style.display = 'block';", ulElement);
  
    const partnerOpt = await ulElement.findElement(By.css('li:nth-child(2)'));
  
    await driver.executeScript("arguments[0].click();", partnerOpt);
  }


  async selectRandomCountry() {
    const { randomCity, selectedCountry } = super.selectRandomCountry();
    if (selectedCountry === "No more countries to search.") {
      return true;
    }

    const contryOpt = await driver
      .findElement(By.id('ullocationInputPeople'))
      .findElement(By.className('stylish-select-left'))
      .findElement(By.className('stylish-select-right styledSelect'));
  
    await driver.executeScript("arguments[0].click();", contryOpt);
  
    const ulElement = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="ullocationInputPeople"]/ul')
        ), 5000
      );
  
    await driver.executeScript("arguments[0].style.display = 'block';", ulElement);

    const cityOption = await ulElement.findElement(
      By.xpath(`.//li[contains(text(), "${randomCity}")]`)
    );
    await driver.executeScript("arguments[0].click();", cityOption);
    
    const searchBtn = await driver.findElement(By.className("btn btn-default js-button-search"));
    await driver.wait(until.elementIsVisible(searchBtn), 5000);
    await driver.wait(until.elementIsEnabled(searchBtn), 5000);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await driver.executeScript("arguments[0].click();", searchBtn);
      return false;
    } catch (error) {}

    return true;
  }

  
  async accessPage(index) {
    if (index !== 0) return;

    await super.accessPage(index);

    const addBtn = await driver.wait(
      until.elementLocated(By.id("onetrust-accept-btn-handler")
      ), 500
    );
    await addBtn.click();
    await this.#clickPartnerOpt();
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("c-content_team__card-details")
      ), 100000
    );
  }


  async #getName(lawyer) {
    return await lawyer
    .findElement(By.className("c-content_team__card-info"))
    .findElement(By.css("a"))
    .findElement(By.className("c-content-team__name en"))
    .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("c-content_team__card-contact en"))
      .findElement(By.className("mail-id-image"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: this._currentCountry,
    };
  }
}

module.exports = MorganLewisAndBockiusLLP;
