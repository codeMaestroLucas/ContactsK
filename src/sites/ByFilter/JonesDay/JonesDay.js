const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");


const { until, By } = require("selenium-webdriver");

//TODO: Transform this in Filter - a lot of trobleshoot in the Country DDD
class JonesDay extends ByPage {
  constructor(
    name = "Jones Day",
    link = "https://www.jonesday.com/en/lawyers#sort=%40fieldz95xalphasort%20ascending&f:@facetz95xtitle=[Partners%20%26%20Of%20Counsel]",
    totalPages = 50,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.jonesday.com/en/lawyers#first=${ index * 20 }&sort=%40fieldz95xalphasort%20ascending&f:@facetz95xtitle=[Partners%20%26%20Of%20Counsel]`;
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
    const items = await driver.wait(
      until.elementsLocated(
        By.className("professional__column--right")
      )
    );
    return items.slice(0, 20);
  }

  async #getName(lawyer) {
    const nameElement = await lawyer.findElement(
      By.className("person__name")
    );
    const html = await nameElement.getAttribute("outerHTML");
    return html.replace('<span class="person__name">', '').replace('</span>', '');
  }

  async #getEmail(lawyer) {
    const emailDivs = await lawyer.findElements(By.css(".person__row--over-inline"));
    
    for (const div of emailDivs) {
      const emailSpan = await div.findElement(By.css("span"));
      const html = await emailSpan.getAttribute("outerHTML");
      if (html.toLowerCase().includes("@jonesday.com")) {
        return html.replace('<span class="person__meta">', '').replace('</span>', '')
      }
    }
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer.findElement(
      By.css("div.person__row > span.person__meta > span.person__phone-listing")
    );
    const html = await dddElement.getAttribute("outerHTML");
    return html.replace('<span class="person__phone-listing">', '').replace('</span>', '');
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = JonesDay;
