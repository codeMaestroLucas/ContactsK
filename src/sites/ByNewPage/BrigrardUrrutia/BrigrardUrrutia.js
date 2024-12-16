const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


class BrigrardUrrutia extends ByNewPage {
  constructor(
    name = "Brigrard Urrutia",
    link = "https://www.bu.com.co/en/lawyers?title=&field_area_target_id=All&field_industrias_target_id=All&field_membership_target_id=1122&field_ciudad_target_id=All&page=3",
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
        By.className("image")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("name-lawyer p-name"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("personal-info"))
      .findElement(By.className("u-email"))
      .findElement(By.css("div > a"))
      .getAttribute("href");
  }


  async #getCountry(lawyer) {
    const city = (await lawyer
      .findElement(By.className("p-locality"))
      .findElement(By.css("div"))
      .getText()
    ).toLowerCase();
      
    
    const cityToCountry = {
      "barranquilla": "Colombia",
      "bogotá": "Colombia",
      "cali": "Colombia",
      "london": "England",
      "singapore": "Singapore"
    };
    
    return cityToCountry[city] || "Unknown";
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("lawyer-card-info"));

    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: await this.#getCountry(details),
    };
  }
}

module.exports = BrigrardUrrutia;
