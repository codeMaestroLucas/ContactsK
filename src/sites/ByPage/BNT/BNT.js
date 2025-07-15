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
    let partners = [];

    const partnersDiv = await driver.wait(
      until.elementsLocated(
        By.css('li.item-entry[data-status="Partner"]')
      ), 100000
    );

    for (let element of partnersDiv) {
      const items = await element.findElements(By.className("item"));
      partners = partners.concat(items);
    }

    const associatePartnersDiv = await driver.wait(
      until.elementsLocated(
        By.css('li.item-entry[data-status="Associated Partner"]')
      ), 100000
    );

    for (let element of associatePartnersDiv) {
      const items = await element.findElements(By.className("item"));
      partners = partners.concat(items);
    }
    return partners
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("item-block"))
      .findElement(By.className("cbListFieldCont cbUserListFC_name list-title member-name"))
      .findElement(By.css("a"))
      .getAttribute("href");
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


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.css('div[data-field-id="7"] > span > a'))
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

module.exports = BNT;
