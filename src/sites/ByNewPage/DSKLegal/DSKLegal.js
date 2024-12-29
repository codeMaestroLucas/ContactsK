const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DSKLegal extends ByNewPage {
  constructor(
    name = "DSK Legal",
    link = "https://dsklegal.com/our-team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);

    const addBtn = await driver.wait(
      until.elementLocated(
        By.className("btn aggree-21")
      ), 100000
    );

    await addBtn.click();
  }


  async getLawyersInPage() {
    const divResults = await driver.wait(
      until.elementLocated(By.id("locnameres"))
    );
  
    const items = await divResults
      .findElement(By.className("row"))
      .findElements(By.css("ul > li"));
  
    let partners = [];
    
    for (let item of items) {
      try {
        await item.findElement(By.className("team-detail"));
        partners.push(item);
        
      } catch (e) {}
    }
  
    return partners;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("h2 > a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return (await driver
      .findElement(By.className("space-left-60 person-name"))
      .getText()
    ).split("<small>")[0];
  }
  
  async #getSocials() {
    const socials = await driver
      .findElement(By.className("contact"))
      .findElements(By.css("li > a"));
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();
    
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "India",
    };
  }
}

module.exports = DSKLegal;
