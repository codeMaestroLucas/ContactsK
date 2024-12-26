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
        By.className("staff")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("staff_more"))
      .findElement(By.css("a"))
      .getAttribute('href');
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("staff_info"))
      .findElement(By.className("staff_name"))
      .findElement(By.css("h3"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socialis = await lawyer
      .findElement(By.className("staff_info"))
      .findElement(By.className("staff_data"))
      .findElements(By.css("a"))

    let email;
    let phone;

    for (let social of socialis) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) phone = href;

      if (email && phone) break;
    }

    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Hong Kong",
    };
  }
}

module.exports = HowseWilliams;
