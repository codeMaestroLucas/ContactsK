const { getCountryByDDD } = require("../../../utils/getNationality");
const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ArthurCox extends ByNewPage {
  constructor(
    name = "Arthur Cox",
    link = "https://www.arthurcox.com/people/?term=&attr2=Partner/",
    totalPages = 9,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.arthurcox.com/people/?term=&offset=${ index + 1 }&attr2=Partner/#search-section`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("search-result-link")
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
      .findElement(By.className("o-content"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('o-content background-white '))
      .findElements(By.css('p > a'));
    return await super.getSocials(socials);
  }
  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("m-header--person__content m-12-12 tp-6-12 u-7-12"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = ArthurCox;
