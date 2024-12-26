const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DechertLLP extends ByPage {
  constructor(
    name = "Dechert LLP",
    link = "https://www.dechert.com/people-search.html?cq=29#position=Partner",
    totalPages = 26,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.dechert.com/people-search.html?cq=29#position=Partner&page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("article > div > div.flex-col.flex-1.w-full")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("mt-2 mb-4 font-serif text-2xl duration-150 transition-opacity hover:opacity-75"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("mt-2 mb-4 font-serif text-2xl duration-150 transition-opacity hover:opacity-75"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElements(By.css("ul > li > a"))

    for (let social of socials) {
      let href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  
  async #getPhone(lawyer) {
    const socials = await lawyer
      .findElements(By.css("div.mt-2.mb-2.leading-relaxed.text-gray-500.prose-xs > p > a"));
    
    for (let social of socials) {
      let href = await social
        .getAttribute("href");
      if (href.includes("tel:+")) return href;
    }
  }


  async getLawyer(lawyer) {
    const phone = await this.#getPhone(lawyer);
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }

}

module.exports = DechertLLP;
