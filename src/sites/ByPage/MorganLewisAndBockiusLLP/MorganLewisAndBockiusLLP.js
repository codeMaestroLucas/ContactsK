const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MorganLewisAndBockiusLLP extends ByPage {
  constructor(
    name = "Morgan Lewis And Bockius LLP",
    link = "https://www.morganlewis.com/our-people",
    totalPages = 1,
  ) {
    super(name, link, totalPages, 500);
  }

  async #clickPartnerOpt() {
    const actions = driver.actions();
    //! The hover prevents the click from the block

    const roleOpt = await driver.wait(
      until.elementLocated(By.className("c-es__show-more-people")), 10000
    )
    await roleOpt.click();

    const positionOpt = await driver
      .findElement(By.id('ulpositionInputPeople'))
      .findElement(By.className('stylish-select-left'))
      .findElement(By.className('stylish-select-right styledSelect'));


    // await actions.move({ origin: positionOpt }).perform();

    // await new Promise(resolve => setTimeout(resolve, 2000));
    // await positionOpt.click();
    

    const ulElement = await driver.findElement(By.css('ul.listing'));
    await driver.executeScript("arguments[0].style.display = 'block';", ulElement);

    const partnerOpt = await ulElement.findElement(By.css('li:nth-child(3)'))
    console.log(await partnerOpt.getAttribute("outerHTML"))

    await actions.move({ origin: partnerOpt }).perform();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await partnerOpt.click();

  }

  async #selectContries() {
    const cities = [
      "Abu Dhabi", "Almaty", "Astana", "Beijing", "Brussels", "Century City",
      "Dubai", "Frankfurt", "Hartford", "Hong Kong", "London", "Munich",
      "Paris", "Shanghai", "Singapore", "Silicon Valley", "Tokyo"
    ];
  

    const contrySelector = await driver
      .findElement(By.xpath('//*[@id="contentWrapper"]/div/div[2]/div/div[2]/div[4]/div[3]/div/div/ul/li[1]/div'));
    await contrySelector.click();

    for (const city of cities) {
      await contrySelector
        .findElement(By.xpath(`//*[text()="${city}"]`))
        .click();
    }
  }

  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);

      await driver.findElement(By.id("onetrust-accept-btn-handler")).click();

      await this.#clickPartnerOpt();

      await this.#selectContries();


    } else {
      try {
        await driver
          .findElement(By.className("c-pagination"))
          .findElement(By.className("c-pagination__list-item"))
          .findElement(By.css("a.c-pagination__link.js-pagination-link.next"))
          .click();
      } catch (e) {}
    }
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("")),
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

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className("c-content_team__card-info"))
      .findElement(By.className("c-content-team__number"))
      .getAttribute("outerHTML");

    return dddElement;
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }
}

module.exports = MorganLewisAndBockiusLLP;

async function main() {
  t = new MorganLewisAndBockiusLLP();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
