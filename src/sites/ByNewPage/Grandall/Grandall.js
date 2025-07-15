const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Grandall extends ByNewPage {
  constructor(
    name = "Grandall",
    link = "http://www.grandall.com.cn/en/lsss/list.aspx?Key=&Position=5342#",
    totalPages = 33,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);
    } else {
      await driver
        .findElement(By.className("a_next"))
        .click();
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }


  async getLawyersInPage() {
    const div = await driver.wait(
      until.elementLocated(
        By.className("ul celarfix")
      ), 100000
    );
    return await div.findElements(By.className("clearfix"));
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return (await lawyer
      .findElement(By.css("h3"))
      .getText()
    ).toLowerCase().replace("partner", "");
  }


  async #getEmail(lawyer) {
    const html = await lawyer
      .findElement(By.className("email"))
      .getAttribute("outerHTML");
    return super.getContentFromTag(html);
  }


  async #getPhone(lawyer) {
    const html = await lawyer
      .findElement(By.className("phone"))
      .getAttribute("outerHTML");
    return super.getContentFromTag(html);
  }

  
  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.xpath('/html/body/div[3]/div/div/div/div[2]')
      ), 5000
    );

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      phone: await this.#getPhone(details),
      country: "China",
    };
  }
}

module.exports = Grandall;
