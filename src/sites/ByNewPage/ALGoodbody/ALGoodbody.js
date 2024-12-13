const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ALGoodbody extends ByNewPage {
  constructor(
    name = "AL Goodbody",
    link = "https://www.algoodbody.com/our-people#",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    const addBtn = await driver.wait(
      until.elementLocated(
        By.id("onetrust-accept-btn-handler")
      ), 3000
    );
    await addBtn.click();
  }


  async getLawyersInPage() {
    await driver.wait(
      until.elementsLocated(
        By.className("wrapper people-group")
      ), 100000
    );

    return await driver
      .findElement(By.css(".wrapper.people-group:first-child"))
      .findElements(By.className("col-desktop-4 col-tablet-6 filter-result"))
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("h1 type-thin color-white spaced2x"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.className("list-symbol color-white"));
    let email;
    let ddd;

    for (let social of socials) {
      const href = await social
        .findElement(By.css("dd > a"))
        .getAttribute("href");
      if (href.includes("tel:+")) ddd = href;
      else if (href.includes("mailto:")) email = href;

      if (email && ddd) break;
    }

    return { email, ddd };
  }

  
  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.className("col-tablet-7 tick-left5x-tablet")
      ), 6000
    );

    const { email, ddd } = await this.#getSocials(details);

    return {
      name: await this.#getName(details),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = ALGoodbody;
