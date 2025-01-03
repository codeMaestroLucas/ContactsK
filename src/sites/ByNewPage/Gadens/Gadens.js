const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Gadens extends ByNewPage {
  constructor(
    name = "Gadens",
    link = "https://www.gadens.com/people/",
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
        By.className("caption")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("h3 > a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("li > h4"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.className("mailIpep"))
      .findElement(By.css("a"))
      .getAttribute('href');

    const phone = await lawyer
      .findElement(By.className("phoneIpep"))
      .getText();

    return { email, phone };
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.css("div.ProfDeatails > ul"));

    const role = (await details
      .findElement(By.className("designation"))
      .getAttribute("outerHTML")
    ).toLowerCase().trim();
    if (!role.includes("partner")) return "Not Partner";

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Australia"
    };
  }
}

module.exports = Gadens;
