const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CampbellsLegal extends ByPage {
  constructor(
    name = "Campbells Legal",
    link = "https://www.campbellslegal.com/people/#filter-+partner",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(until.elementsLocated(
      By.className("item person exclude-search-- position--partner show--people no-filter--location filter--position"))
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("wp-post-image-wrap"))
      .findElement(By.className("view_person"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("title"))
      .findElement(By.css("a.view_person"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('meta'))
      .findElements(By.css('a'));
  
    let email;
    let phone;
  
    for (let social of socials) {
      const href = await social
        .getAttribute('href');
  
      if (href.includes('mailto:')) email = href;
      else if (href.includes('tel:')) phone = href;
  
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
      country: getCountryByDDD(phone),
    };
  }

}

module.exports = CampbellsLegal;
