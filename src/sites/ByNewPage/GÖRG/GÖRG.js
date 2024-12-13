const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GÖRG extends ByNewPage {
  constructor(
    name = "GÖRG",
    link = "https://www.goerg.de/en/our-people?positions[]=8&positions[]=4&positions[]=233&positions[]=8&positions[]=4&positions[]=233&page=1",
    totalPages = 10,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherLink = `https://www.goerg.de/en/our-people?positions[]=8&positions[]=4&positions[]=233&positions[]=8&positions[]=4&positions[]=233&page=${ index + 1 }`
    await super.accessPage(index, otherLink);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("field-content")
      ), 100000
    );
    return lawyers.splice(1);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return (await driver
      .findElement(By.className("contact-information-wrapper"))
      .findElement(By.css("img"))
      .getAttribute("alt"))
      .toLowerCase().replace("portrait", "");
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("field-email"))
      .findElement(By.className("email-link"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Germany",
    };
  }

}

module.exports = GÖRG;
