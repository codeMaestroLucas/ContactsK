const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class BarneaAndCo extends ByNewPage {
  constructor(
    name = "Barnea And Co",
    link = "https://barlaw.co.il/the-team",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementLocated(
        By.className("leftSide left teamPartnersBlock team-search-mobile-results line-524")
      ), 100000
    );
    return await lawyers.findElements(By.css("div.leftSideblockTextLink > a"));
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const html = await driver
      .findElement(By.className("rightSideTitle casBoldItalic-alefBold"))
      .getAttribute("outerHTML");
    return await super.getContentFromTag(html);
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("about_mail blockText"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Israel",
    };
  }
}

module.exports = BarneaAndCo;
