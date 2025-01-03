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
    return (await driver.wait(
      until.elementsLocated(
          By.className("custom-link")
        ), 100000
      )
    ).splice(1);
    // This is remove just the first element?
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("wp-block-post-title has-text-color has-blue-color has-x-large-font-size"))
      .getText();
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
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: '8769225860', // Always the same phone number
      country: "Jamaica",
    };
  }
}

module.exports = MyersFletcherAndGordon;
