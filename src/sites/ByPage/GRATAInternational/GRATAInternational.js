const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GRATAInternational extends ByPage {
  constructor(
    name = "GRATA International",
    link = "https://gratanet.com/global/regions#teams",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);

    const loadMoreBtn = await driver
      .findElement(By.css("div#teams.person-info__teams"))
      .findElement(By.css("div.show-more"))
      .findElement(By.name("show-name"));

    for (let i = 0; i < 4; i++) {
      const actions = driver.actions();
      //! The hover prevents the click from the block
      await actions.move({ origin: loadMoreBtn }).perform();

      await new Promise(resolve => setTimeout(resolve, 1000));

      await loadMoreBtn.click();

      await super.rollDown(1, 1);
    }
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("person")
      ), 100000
    );
    const webRole = [
      By.className("person__info"),
      By.className("person__info-short"),
      By.className("person__position"),
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false)
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("div > img"))
      .getAttribute("alt")
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('person__info'))
      .findElement(By.className('person__info-full'))
      .findElements(By.css('a'));
    return await super.getSocials(socials, true);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(phone),
    };
  }

}

module.exports = GRATAInternational;
