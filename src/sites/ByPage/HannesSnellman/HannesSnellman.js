const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HannesSnellman extends ByPage {
  constructor(
    name = "Hannes Snellman",
    link = "https://www.hannessnellman.com/people/?roles=Partners",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    for (let c = 0; c < 4; c++) {
      await driver.executeScript("helper.loadMoreItems()");
      await driver.sleep(1500); // Wait for the new content to load
    }
  }
  

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.css(".person-wrapper.txt-c.u-pb-2 > .text-content")
      ), 100000
    );
    return lawyers.slice(1);  // The first element is invalid
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("h-4 u-z-2 p-rel person-name-text"))
      .getAttribute("outerHTML");
    return this.getContentFromTag(html);
  }


  async #getEmail(lawyer) {
    const html = await lawyer
      .findElement(By.className("extra-info"))
      .findElement(By.className("p-rel u-z-2 m-black person-email-text"))
      .getAttribute("outerHTML");
      return `${ (await this.getContentFromTag(html)).trim() }@hannessnellman.com`;
  }
  
  
  async #getPhone(lawyer) {
    const html = await lawyer
      .findElement(By.className("extra-info"))
      .findElement(By.className("p-rel u-z-2 m-black"))
      .getAttribute("outerHTML");
    return this.getContentFromTag(html);
  }

  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: await this.#getPhone(lawyer),
      country: "Finland"
    };
  }
}

module.exports = HannesSnellman;
