const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class WikborgRein extends ByNewPage {
  constructor(
    name = "Wikborg Rein",
    link = "https://www.wr.no/en/people?position=71016",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    await super.rollDown(8, 0.3);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.xpath('//*[@id="main-content"]/article/section/div/div/div/div[2]/div[1]/div/a')
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("mb-10"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials() {
    const phone = await driver
      .findElement(By.xpath('//*[@id="main-content"]/section/div/div/div[2]/div[2]/div/div[3]/div[1]/div[1]/div[2]'))
      .getText();
    const email = await driver
      .findElement(By.xpath('//*[@id="main-content"]/section/div/div/div[2]/div[2]/div/div[3]/div[1]/div[2]/a'))
      .getAttribute('href');
    return { email, phone };
  }
  
  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Norway"
    };
  }
}

module.exports = WikborgRein;
