const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");


const { until, By } = require("selenium-webdriver");

class JonesDay extends ByPage {
  constructor(
    name = "Jones Day",
    link = "https://www.jonesday.com/en/lawyers#sort=%40fieldz95xlevelsort%20ascending&f:@facetz95xlocation=[Amsterdam,Beijing,Brisbane,Brussels,Dubai,D%C3%BCsseldorf,Frankfurt,Hong%20Kong,London,Madrid,Milan,Munich,Paris,Perth,S%C3%A3o%20Paulo,Shanghai,Singapore,Sydney,Taipei,Tokyo]&f:@facetz95xtitle=[Partners%20%26%20Of%20Counsel]",
    totalPages = 16,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.jonesday.com/en/lawyers#first=${ index * 20 }&sort=%40fieldz95xlevelsort%20ascending&f:@facetz95xlocation=[Amsterdam,Beijing,Brisbane,Brussels,Dubai,D%C3%BCsseldorf,Frankfurt,Hong%20Kong,London,Madrid,Milan,Munich,Paris,Perth,S%C3%A3o%20Paulo,Shanghai,Singapore,Sydney,Taipei,Tokyo]&f:@facetz95xtitle=[Partners%20%26%20Of%20Counsel]`;
    await super.accessPage(index, otherUrl);
    try {
      const addBtn = await driver.wait(
        until.elementLocated(
          By.id("onetrust-accept-btn-handler")
        ), 8000
      );
      await addBtn.click();
    } catch (e) {}

    new Promise(resolve => setTimeout(resolve, 5000));
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("professional__container CoveoResultLink")
      )
    );
    
    const webRole = [
      By.className("professional__row--horizontal"),
      By.className("professional__column--right"),
      By.css("div.person__row:first-child"),
      By.css("p.person__row:last-child"),
      By.className("person__title")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
     .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("professional__column--right"))
      .findElement(By.className("person__name"))
      .getAttribute("outerHTML")
    return await super.getContentFromTag(html);
  }


  async #getEmail(lawyer) {
    const emailDivs = await lawyer
      .findElement(By.className("professional__column--right"))
      .findElements(By.css(".person__row--over-inline"));
    
    for (const div of emailDivs) {
      const html = await div
        .findElement(By.css("span"))
        .getAttribute("outerHTML");

      const email = await super.getContentFromTag(html);
      if (email.toLowerCase().includes("@jonesday")) return email;
    }
  }


  async #getPhone(lawyer) {
    const html = await lawyer
      .findElement(By.className("professional__column--right"))
      .findElement(By.css("div.person__row > span.person__meta > span.person__phone-listing"))
      .getAttribute("outerHTML");

    return await super.getContentFromTag(html);
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

module.exports = JonesDay;
