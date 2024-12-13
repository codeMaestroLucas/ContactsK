const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DSKLegal extends ByPage {
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
  
    const div = await divResults.findElement(By.className("row"));
  
    let items = await div.findElements(By.css("ul > li"));
    let validItems = [];
    
    for (let item of items) {
      try {
        await item.findElement(By.className("team-detail"));
        validItems.push(item);
        
      } catch (e) {}
    }
  
    return validItems;
  }
  
  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h2 a"))
      .getText();
  }

  async #getEmail(lawyer) {
    const liElements = await lawyer.findElements(By.css("ul > li"));
    
    for (let li of liElements) {
      const href = await li
        .findElement(By.css("a[href^='mailto:']"))
        .getAttribute("href");
      
      if (href) return href;
    }
  }
  

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }
}

module.exports = DSKLegal;
