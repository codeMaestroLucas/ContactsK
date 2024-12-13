const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


//! This site takes long time to load the new page
class Borenius extends ByNewPage {
  constructor(
    name = "Borenius",
    link = "https://www.borenius.com/people/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  
    await driver
      .findElement(By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"))
      .click();

    // Country option
    const country = await driver
      .findElement(By.xpath('//*[@id="content"]/div/section[3]/div[1]/div/div[1]/div[2]/button'));
    await country.click();

    const opts = await country
      .findElement(By.xpath('//*[@id="content"]/div/section[3]/div[1]/div/div[1]/div[2]/div/div/div[2]/div/ul'))
      .findElements(By.css('li'));

    for (let c = 0; c < 3; c++) {
      await opts[c].click();
    }
      

    // Role option
    const selectRole = await driver
      .findElement(By.xpath('//*[@id="content"]/div/section[3]/div[1]/div/div[1]/div[3]/button'));
    await selectRole.click();
    await selectRole
      .findElement(By.xpath('//*[@id="content"]/div/section[3]/div[1]/div/div[1]/div[3]/div/div/div[2]/div/ul'))
      .findElement(By.css("li:first-child"))
      .click();
  
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  

  async getLawyersInPage() {
    const lawyerDiv = await driver.wait(
      until.elementLocated(
        By.className("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-18")
      ), 100000
    );
    return await lawyerDiv.findElements(By.className("focus-outline-red"));
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail() {
    const socials = await driver
      .findElement(By.className("font-light text-base mt-25"))
      .findElements(By.className("my-8"))

    for (let social of socials) {
      const href = await social
        .findElement(By.css("a"))
        .getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Finland",
    };
  }

}

module.exports = Borenius;
