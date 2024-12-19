const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MorganLewisAndBockiusLLP extends ByPage {
  constructor(
    name = "Morgan Lewis And Bockius LLP",
    link = "https://www.morganlewis.com/our-people",
    totalPages = 14,
  ) {
    super(name, link, totalPages);

    this._citiesMap = {
      "Abu Dhabi": "Uthe AE",
      "Almaty": "Kazakhstan",
      "Astana": "Kazakhstan",
      "Beijing": "China",
      "Brussels": "Belgium",
      "Dubai": "the UAE",
      "Frankfurt": "Germany",
      "Hong Kong": "China",
      "London": "England",
      "Munich": "Germany",
      "Paris": "France",
      "Shanghai": "China",
      "Singapore": "Singapore",
      "Tokyo": "Japan"
    };

    this._currentCountry = ""
  }

  async #clickPartnerOpt() {
    const roleOpt = await driver.wait(
      until.elementLocated(By.className("c-es__show-more-people")),
      10000
    );
    
    // Scroll to the element and ensure visibility
    await driver.executeScript("arguments[0].scrollIntoView(true);", roleOpt);
    await driver.executeScript("arguments[0].click();", roleOpt);
  
    const positionOpt = await driver
      .findElement(By.id('ulpositionInputPeople'))
      .findElement(By.className('stylish-select-left'))
      .findElement(By.className('stylish-select-right styledSelect'));
  
    // Scroll to position selector
    await driver.executeScript("arguments[0].scrollIntoView(true);", positionOpt);
    await driver.executeScript("arguments[0].click();", positionOpt);
  
    const ulElement = await driver.findElement(By.css('ul.listing'));
    // Force display of the dropdown
    await driver.executeScript("arguments[0].style.display = 'block';", ulElement);
  
    const partnerOpt = await ulElement.findElement(By.css('li:nth-child(2)'));
  
    // Scroll and click the partner option
    await driver.executeScript("arguments[0].scrollIntoView(true);", partnerOpt);
    await driver.executeScript("arguments[0].click();", partnerOpt);
  }


  async #selectRandomCountry() {
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
  
    const cityKeys = Object.keys(this._citiesMap);
    const randomCity = cityKeys[Math.floor(Math.random() * cityKeys.length)];

    this._currentCountry = this._citiesMap[randomCity];
  
    const cityOption = await ulElement.findElement(
      By.xpath(`.//li[contains(text(), "${randomCity}")]`)
    );
    await driver.executeScript("arguments[0].click();", cityOption);
  }

  
  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);

      await driver.findElement(By.id("onetrust-accept-btn-handler")).click();

      await this.#clickPartnerOpt();
    }

    await this.#selectRandomCountry();

    // Click on search btn
    await driver
      .findElement(By.className("btn btn-default js-button-search"))
      .click();

    await new Promise(resolve => setTimeout(resolve, 1500));

    // } else {
    //   let nextButton = await driver.wait(
    //     until.elementLocated(By.css('li.c-pagination__list-item a.c-pagination__link.next')),
    //     10000
    //   );
  
    //   await driver.executeScript("arguments[0].scrollIntoView(true);", nextButton);
  
    //   await driver.wait(until.elementIsVisible(nextButton), 10000);
  
    //   await nextButton.click();
    // }
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("c-content_team__card-details")),
      100000
    );
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
    .findElement(By.className("c-content_team__card-info"))
    .findElement(By.css("a"))
    .findElement(By.className("c-content-team__name en"))
      .getText();

    return nameElement;
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className("c-content_team__card-contact en"))
      .findElement(By.className("mail-id-image"))
      .findElement(By.css("a"))
      .getAttribute("href");

    return emailElement;
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

async function main() {
  t = new MorganLewisAndBockiusLLP();
  t.searchForLawyers();
}

main();
