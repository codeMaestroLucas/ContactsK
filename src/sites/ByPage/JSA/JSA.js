const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class JSA extends ByPage {
  constructor(
    name = "JSA",
    link = "https://www.jsalaw.com/our-people/?service=&sector=&people_role=Partner&location=",
    totalPages = 12,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `${ this._link }&p_num=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
    try {
      const addBtn = await driver.findElement(
        By.id("wpdp-close")
      )
      await addBtn.click();
    } catch (e) {}
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css(".team-list-seprate a")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("figcaption h3"))
      .getText();
}

async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("ul > li:nth-of-type(2) > span"))
      .getText();
}


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }
}

module.exports = JSA;
