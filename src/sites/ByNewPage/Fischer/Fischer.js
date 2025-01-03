const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Fischer extends ByNewPage {
  constructor(
    name = "Fischer",
    link = "https://www.fbclawyers.com/team/",
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
        By.css(".col-xs-12 > ul.all-attorneys > ul.column > li > a")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("blue-box"))
      .findElement(By.className("col-xs-6 second"))
      .findElement(By.css("p > a"))
      .getAttribute("href");
  }
  

  async #getPhone(lawyer) {
    const html = await lawyer
      .findElement(By.className("blue-box"))
      .findElement(By.className("col-xs-6 second"))
      .findElement(By.css("p"))
      .getAttribute("outerHTML");
  
    return (await super.getContentFromTag(html)).trim();
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("lawyer"))
      .findElement(By.className("col-xs-7"));

    // The info about the role just is available in the new Page
    const role = (await details
      .findElement(By.css("h2"))
      .getText()
    ).toLowerCase();

    if (!role.includes("partner")) return "Not Partner";

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      phone: await this.#getPhone(details),
      country: "Israel"
    };
  }
}

module.exports = Fischer;
