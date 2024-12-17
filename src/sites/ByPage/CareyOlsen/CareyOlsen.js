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

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("position-location"))
        .getText()
      ).toLowerCase();

      if (role.includes("partner")) partners.push(lawyer)
    }
    return partners
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

  async #getDDD(lawyer) {
    return await lawyer
      .findElement(By.css(".phone.direct-line a"))
      .getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }
}

module.exports = CareyOlsen;
