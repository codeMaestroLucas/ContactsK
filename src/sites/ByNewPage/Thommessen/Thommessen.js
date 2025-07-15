const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Thommessen extends ByNewPage {
  constructor(
    name = "Thommessen",
    link = "https://www.thommessen.no/en/people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);

    await driver.executeScript("CookieInformation.submitAllCategories()");

    await driver
      .findElement(By.xpath('/html/body/main/div/employees-component/div/div/div[1]/div/button'))
      .click();

    const roleSelector = await driver
      .findElement(By.xpath(`/html/body/main/div/employees-component/div/div/div[1]/div/ul/li[1]`));

    await new Promise(resolve => setTimeout(resolve, 400));
    await roleSelector.click();
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const partnerOpt = await roleSelector.findElement(By.css("ul > li:nth-child(3)"));
    await driver.executeScript(
      "arguments[0].className = 'Button__main ButtonFilter__option ButtonFilter__selected';",
      partnerOpt
    );

    await new Promise(resolve => setTimeout(resolve, 300));

    await super.rollDown(3, 0.3);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.css("ul.GridList__main > li > a")
      ), 100000
    );

    const webRole = [
      By.className("personlink__image-content"),
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("person__main"))
      .findElement(By.css("header > h1"))
      .getText();
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.className("person__contact"))
      .findElements(By.css("div > a"))
    return await super.getSocials(socials);
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

module.exports = Thommessen;
