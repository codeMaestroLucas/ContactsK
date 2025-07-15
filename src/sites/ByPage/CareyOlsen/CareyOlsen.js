const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CareyOlsen extends ByPage {
  constructor(
    name = "Carey Olsen",
    link = "https://www.careyolsen.com/people-search-results?peoplesearch=true&namePeopleFilter=&servicePeopleFilter=&locationPeopleFilter=&lawsPractisedPeopleFilter=&peoplesearch=true",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
    try {
      const addBtn = await driver.wait(
        until.elementLocated(By.id("ccc-recommended-settings")
      ), 1500
      );
      await addBtn.click();
      await super.rollDown(1, 0.5);
    } catch (e) {}
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("generic-content")
      ), 100000
    );

    const webRole = [
      By.className("position-location")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("image"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h3 > a"))
      .getText();
  }


  async #getEmail(lawyer) {
    const email = await lawyer
      .findElement(By.className("button outline"))
      .getAttribute("href");
    
    const match = email.match(/mailto:([^?]+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.css(".phone.direct-line a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    const phone = await this.#getPhone(lawyer);
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = CareyOlsen;
