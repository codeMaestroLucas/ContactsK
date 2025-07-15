const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ArnoldAndPorter extends ByPage {
  constructor(
    name = "Arnold And Porter",
    link = "https://www.arnoldporter.com/en/people?offices=6345e0f4-64a2-4698-8117-fb2c8311cfc5,4dfbc043-3bdf-df98-7dbd-9579ed375007,dfcf7436-a067-b337-91ac-e8f2ff7e912a,effc1763-f448-4d06-94f5-9bb5a082a8f8,ef390be5-f9a7-434a-927e-22f81d498b35&titles=c9a37860-0e03-294c-b0ba-bdca9259042b&skip=20&sort=0&reload=false&scroll=4332.7998046875",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person-item col-row")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("person-item-info col col2-5"))
      .findElement(By.className("person-item-name search-result-item"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("person-item-info col col2-5"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("person-item-contact-info col col2-5"))
      .findElements(By.css("a"));
  
    let email = null;
    let phone = null;
  
    for (let social of socials) {
      const href = await social.getAttribute("href");
  
      if (href.includes("mailto:")) email = href;
      
      else if (href.includes("tel:")) {
        if (!href.startsWith("tel:++1")) { // Skip US ddd
          phone = href;
        }
      }
  
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

module.exports = ArnoldAndPorter;
