const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GornitzkyAndCo extends ByNewPage {
  constructor(
    name = "Gornitzky And Co",
    link = "https://www.gornitzky.com/attorneys/?letter=&member=&practice=&role=8#pageContent",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("item part-member-simple")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("member-name-wrapper"))
      .findElement(By.className("member-name m-b-10-xs m-b-5-sm line-height-1 text-center-visible-xs"))
      .getText();
  }


  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElement(By.className("member-information-list list-unstyled m-b-5-xs m-b-0-sm"))
      .findElements(By.css("li > span > a"));

    for (let social of socials) {
      const href = (await social.getAttribute("href")).toLowerCase();
      if (href.includes("mailto:")) return href.replace("?cc=marketing@gornitzky.com", "");
    }
  }


  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("member-content-wrap"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Israel",
    };
  }
}

module.exports = GornitzkyAndCo;
