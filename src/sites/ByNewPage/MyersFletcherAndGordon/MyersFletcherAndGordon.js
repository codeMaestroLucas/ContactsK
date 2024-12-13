const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MyersFletcherAndGordon extends ByNewPage {
  constructor(
    name = "Myers Fletcher And Gordon",
    link = "https://myersfletcher.com/attorneys/?_sft_position=partner",
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
      until.elementsLocated(
        By.className("custom-link")
      ), 100000
    );
    console.log(lawyers.length);
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className("wp-block-post-title has-text-color has-blue-color has-x-large-font-size"))
      .getText();

    
    return nameElement
  }

  
  async #getEmail() {
    const elements = await driver
      .findElements(By.className("contact-dropdown-item"))

    for (let element of elements) {
      const href = await element
        .findElement(By.css("a"))
        .getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Jamaica",
    };
  }

}

module.exports = MyersFletcherAndGordon;
