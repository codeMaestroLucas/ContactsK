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
    super(name, link, totalPages, 100);
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

      await new Promise(resolve => setTimeout(resolve,1000));

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
    let partners = await super.filterPartnersInPage(lawyers, webRole, false)
    return partners;
  }


  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.css("div > img"))
      .getAttribute("alt")

    
    return nameElement
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('person__info'))
      .findElement(By.className('person__info-full'))
      .findElements(By.css('a'));
  
    let email;
    let ddd;
  
    for (let social of socials) {
      const href = await social.getAttribute('href');
  
      if (href.includes('mailto:')) email = href;
      else if (href.includes('tel:')) ddd = href;
  
      if (email && ddd) break;
    }
  
    return { email, ddd };
  }


  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = GRATAInternational;

async function main() {
  t = new GRATAInternational();
  // t.accessPage(0);
  t.searchForLawyers();
}

main();
