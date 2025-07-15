const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class FangdaPartners extends ByNewPage {
  constructor(
    name = "Fangda Partners",
    link = "https://www.fangdalaw.com/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  
  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);
  
      await driver
        .findElement(By.xpath('//*[@id="category_list"]/div[2]/select/option[4]'))
        .click();
    } else {
      const loadMoreBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div[4]/div/span'));
      
      for (let c = 0; c < 4; c++) {
        // Each iteration loads more 10 partners
        // Total of 19 iterations
        await driver.executeScript("arguments[0].click();", loadMoreBtn);
          await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("parthner_name")
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
      .findElement(By.css("h3"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("div:last-child"))
      .getText();
  }


  async #getPhone(lawyer) {
    return (await lawyer
      .findElement(By.css("div:nth-child(4)"))
      .getText()
    ).split(" / ")[0];
  }


  async #getCountry(lawyer) {
    const country = (await lawyer
      .findElement(By.className("location"))
      .getText()
    ).toLowerCase();

    return (country.includes("hong kong")) ? "Hong Kong" : "China";
  }

  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("profile_info"));

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      phone: await this.#getPhone(details),
      country: await this.#getCountry(details)
    };
  }
}

module.exports = FangdaPartners;
