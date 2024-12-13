const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CampbellsLegal extends ByPage {
  constructor(
    name = "Campbells Legal",
    link = "https://www.campbellslegal.com/people/#filter-+partner",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(until.elementsLocated(
      By.className("item person exclude-search-- position--partner show--people no-filter--location filter--position"))
    );
    console.log(lawyers.length);
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer.findElement(
      By.className("view_person")
    );
    console.log(await nameElement.getAttribute("outerHTML"));
    console.log(await nameElement.getText());
    return await nameElement.getText();
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer.findElement(
      By.css("h2.title > a")
    );
    console.log(await emailElement.getAttribute("outerHTML"));
    console.log(await emailElement.getText());

    return await emailElement.getAttribute("href");
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer.findElement(
      By.className("phone")
    );
    console.log(await dddElement.getAttribute("outerHTML"));
    console.log(await dddElement.getText());
    return await dddElement.getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = CampbellsLegal;
