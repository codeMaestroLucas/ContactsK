const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Legalis extends ByNewPage {
  constructor(
    name = "Legalis",
    link = "https://legalis.no/advokater",
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
        By.xpath(`/html/body/section[4]/div/a`)
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials() {
    const socials = await driver
      .findElements(By.css("a"));
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const role = (await driver
      .findElement(By.xpath(`/html/body/div[2]/section[1]/span`))
      .getText()
    ).toLowerCase().trim();
      // .getAttribute('outerHTML');
    if (!role.includes('partner')) return "Not Partner";

    const details = await driver.findElement(By.className("mb-4 md:mb-8"));
    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: 'Norway'
    };
  }
}

module.exports = Legalis;
