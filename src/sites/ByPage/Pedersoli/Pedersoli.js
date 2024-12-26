const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Pedersoli extends ByPage {
  constructor(
    name = "Pedersoli",
    link = "https://pglex.it/en/professionals/?ricerca=1&lettera=&ruoli=partner&area_attivita=&sede=&testo=",
    totalPages = 5,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://pglex.it/en/professionals/page/${ index + 1 }/?ricerca=1&lettera&ruoli=partner&area_attivita&sede&testo`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("col-12 mb-4 cardProfessionista")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
     .findElement(By.css("h2"))
     .findElement(By.className("linkTitolo"))
     .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.css("h2"))
      .findElement(By.className("linkTitolo"))
      .getAttribute("outerHTML");

    return await super.getContentFromTag(html);
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElements(By.className("linkProfessionista"));

    let email;
    let phone;

    for (let social of socials) {
      const html = await social.getAttribute("outerHTML");
      const href = await super.getContentFromTag(html);

      if (href.includes("pglex.it")) email = href;
      else if (href.includes("+")) phone = href;

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
      country: "Italy"
    };
  }
}

module.exports = Pedersoli;

async function main() {
  t = new Pedersoli();
  t.searchForLawyers();
}

main();