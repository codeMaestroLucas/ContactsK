const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HowseWilliams extends ByPage {
  constructor(
    name = "Howse Williams",
    link = "https://www.howsewilliams.com/en/our_people.php?john=1&page=1",
    totalPages = 6,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.howsewilliams.com/en/our_people.php?john=1&page=${ index +  1}`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("staff_info")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("staff_name"))
      .findElement(By.css("h3"))
      .getText();
  }

  async #getEmail(lawyer) {
    const socialis = await lawyer
      .findElement(By.className("staff_data"))
      .findElements(By.css("a"))

    for (let social of socialis) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }



  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Hong Kong",
    };
  }
}

module.exports = HowseWilliams;
