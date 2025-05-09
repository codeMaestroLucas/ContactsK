const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GideLoyretteNouel extends ByPage {
  constructor(
    name = "Gide Loyrette Nouel",
    link = "https://www.gide.com/en/lawyers/",
    totalPages = 11
  ) {
    super(name, link, totalPages);
  }

  //TODO: try to fix this.
  async accessPage(index) {
    await super.accessPage(index);

    const coockieBtn = await driver.wait(
      until.elementLocated(By.id("onetrust-accept-btn-handler"))
    );
    await coockieBtn.click();
    // await driver.findElement(By.id("onetrust-accept-btn-handler")).click();

    if (index == 0) {
      const filterOpt = await driver
        .findElement(By.className("filters"))
        .findElement(By.className("list"));

      await filterOpt.findElement(By.css("li:nth-child(1)")).click();

      const partnerOpt = await driver.wait(
        until.elementLocated(
          By.className("filters"),
          By.className("list"),
          By.css("li:nth-child(3)"),
          By.id("filter-68115402e93ee")
        ),
        8000
      );
      // console.log(await partnerOpt.getAttribute("outerHTML"));
      await partnerOpt.click();
      // .click();

      // await driver.findElement(By.id("filter-68115402e93ee")).click();
      // await driver.sleep(1000);
    } else {
      const btn = await driver
        .findElement(By.className("pagination"))
        .findElement(By.className("next"))
        // console.log(await btn.getAttribute("outerHTML"));
        .click();
      // await btn.click();
    }

    // const otherUrl = `https://www.gide.com/en/avocats?search_api_aggregation_1=&field_expertise_tr_references=All&field_expertise_tr_references_sub=&field_region_tr_references=All&field_office_er_references=&search_api_views_fulltext=partner&page=${index}`;
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("visitCard")),
      100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("div.node-lawyer > a > h1"))
      .getText();
  }

  async #getSocial(lawyer) {
    const socials = await lawyer.findElements(By.css(".contact > div"));

    let email = await socials[2].findElement(By.css("a")).getText();

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
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = GideLoyretteNouel;
