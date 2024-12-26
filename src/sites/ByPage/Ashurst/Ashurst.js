const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Ashurst extends ByPage {
  constructor(
    name = "Ashurst",
    link = "https://www.ashurst.com/en/people/#e=0",
    totalPages = 134
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.ashurst.com/en/people/#e=${ index * 10 }`;
    await super.accessPage(index, otherUrl);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("profile-card__info")
      ), 100000
    );

    let partners = [];
    let html;

    for (let lawyer of lawyers) {
      try {
        html = await lawyer
          .findElement(By.className("people-info"))
          .getAttribute("outerHTML");

      } catch (error) {
        html = await lawyer
          .findElement(By.css("div:nth-child(1)")) // This avoid some mistakes
          .getAttribute("outerHTML");
      }

      const regex = /<div class="people-info">.*?<a[^>]*>.*?<\/a>\s*([^<]+)/;
      const match = html.match(regex);
      const role = match[1].trim();

      if (role.toLowerCase().includes("partner")) partners.push(lawyer);
    }

    return partners;
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("people-info"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("div:nth-child(1)"))
      .findElement(By.css("a > h3"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("a:nth-child(3)"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.css("a:nth-child(2)"))
      .getAttribute("href");
  }
  

  async getLawyer(lawyer) {
    const data = await lawyer.findElement(By.className("profile-contact"));
    const phone = await this.#getPhone(data);
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(data),
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = Ashurst;
