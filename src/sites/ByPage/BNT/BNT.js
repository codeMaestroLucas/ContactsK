const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class BNT extends ByPage {
  constructor(
    name = "BNT",
    link = "https://bnt.eu/attorneys/?field_1_contains=&bps_form=33837&bps_form_page=%2Fattorneys%2F",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    const div = await driver.wait(
      until.elementsLocated(
        By.css('li.item-entry[data-status="Partner"]')
      ), 100000
    );
    let lawyers = [];
    for (let element of div) {
      const items = await element.findElements(By.className("item"));
      lawyers = lawyers.concat(items);  // This flattens the array
    }
    //TODO Question: Does Associate Partner counts? P = 46 & P + Ap = 64
    return lawyers
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("item-block"))
      .findElement(By.className("cbListFieldCont cbUserListFC_name list-title member-name"))
      .findElement(By.css("a"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css('div[data-field-id="email"] > span > a'))
      .getAttribute("href");
  }

  async #getDDD(lawyer) {
    return await lawyer
      .findElement(By.css('div[data-field-id="7"] > span > a'))
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

module.exports = BNT;
