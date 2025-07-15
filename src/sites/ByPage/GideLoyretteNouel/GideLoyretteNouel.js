const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GideLoyretteNouel extends ByPage {
  constructor(
    name = "Gide Loyrette Nouel",
    link = "https://www.gide.com/en/avocats?search_api_aggregation_1=&field_expertise_tr_references=All&field_expertise_tr_references_sub=&field_region_tr_references=All&field_office_er_references=&search_api_views_fulltext=partner",
    totalPages = 4
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.gide.com/en/avocats?search_api_aggregation_1=&field_expertise_tr_references=All&field_expertise_tr_references_sub=&field_region_tr_references=All&field_office_er_references=&search_api_views_fulltext=partner&page=${index}`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("visitCard")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.css("div.node-lawyer > a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("div.node-lawyer > a > h1"))
      .getText();
  }

  async #getSocial(lawyer) {
    const socials = await lawyer.findElements(By.css(".contact > div"));

    let email = await socials[2]
      .findElement(By.css("a"))
      .getText();

    let phone = null;

    for (let social of socials) {
      const href = await social.getText();
      if (href.includes("+")) {
        phone = href;
      }
    }
    
    return { email, phone };
  }

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocial(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = GideLoyretteNouel;
