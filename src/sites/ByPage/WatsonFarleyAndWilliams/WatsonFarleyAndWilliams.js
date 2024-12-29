const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class WatsonFarleyAndWilliams extends ByPage {
  constructor(
    name = "Watson Farley And Williams",
    link = "https://www.wfw.com/people/?_sft_role=partner",
    totalPages = 18
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `${ this._link }&sf_paged=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("people_list_info")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("h3_styler"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("h3_styler"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML");
    return await super.getContentFromTag(html);
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("people_left_stats_ctas_email"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("people_left_stats_phone"))
      .findElement(By.css("span"))
      .findElement(By.css("a"))
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

module.exports = WatsonFarleyAndWilliams;
