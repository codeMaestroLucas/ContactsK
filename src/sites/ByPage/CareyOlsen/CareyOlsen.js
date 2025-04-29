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
        until.elementLocated(By.id("ccc-recommended-settings")),
        1500
      );
      await addBtn.click();
      await super.rollDown(1, 0.5);
    } catch (e) {}
  }
  

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("generic-content")),
      100000
    );

    const webRole = [By.className("position-location")];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }


  async #getName(lawyer) {
    return await lawyer.findElement(By.css("h3 > a")).getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css("a"));
    return await super.getSocials(socials, true);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email.replace("?subject=website%20enquiry:", ""),
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = CareyOlsen;
