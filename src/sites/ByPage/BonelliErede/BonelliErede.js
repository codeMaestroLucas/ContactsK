const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class BonelliErede extends ByPage {
  constructor(
    name = "BonelliErede",
    link = "https://www.belex.com/en/professional/",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
    await this.rollDown(3, 1);
  }

  async getLawyersInPage() {
    const partDiv = await driver.wait(
      until.elementsLocated(By.className("partners")),
      100000
    );

    let partners = [];

    for (let partner of partDiv) {
      partners.push(await partner.findElements(By.className("card")));
    }

    const localPartDiv = await driver.wait(
      until.elementsLocated(By.className("local_partners")),
      100000
    );

    for (let partner of localPartDiv) {
      partners.push(await partner.findElements(By.className("card")));
    }

    const selectedPartners = [];
    if (partners[1]) selectedPartners.push(...partners[1]);
    if (partners[3]) selectedPartners.push(...partners[3]);

    return selectedPartners;
  }

  async #getName(lawyer) {
    const names = await lawyer
      .findElement(By.className("anag"))
      .findElement(By.className("name"))
      .findElement(By.css("a"))
      .findElements(By.css("span"));

    const firstNameHTML = await names[0].getAttribute("outerHTML");
    const lastNameHTML = await names[1].getAttribute("outerHTML");

    const regex = /<span[^>]*>(.*?)<\/span>/;

    const firstNameMatch = firstNameHTML.match(regex);
    const firstName = firstNameMatch[1].trim();

    const lastNameMatch = lastNameHTML.match(regex);
    const lastName = lastNameMatch[1].trim();

    return `${firstName} ${lastName}`;
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("addresses"))
      .findElements(By.css("a"));
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

module.exports = BonelliErede;
