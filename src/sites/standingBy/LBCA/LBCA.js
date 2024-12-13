
const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

//TODO: Site caiu do ar, ir dps
class LBCA extends ByNewPage {
  constructor(
    name = "LBCA",
    link = "https://lbca.com.br/equipe/",
    totalPages = 6,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    if (index === 0 ) {
      await super.accessPage(index);

      await driver
        .findElement(By.name('_cargos-profissionais'))
        .findElement(By.css("option:last-child"))
        .click();

      await new Promise(resolve => setTimeout(resolve, 1200));
    } else {
      await driver
        .findElement(By.className("jet-filters-pagination"))
        .findElement(By.className("jet-filters-pagination__item prev-next next"))
        .click();

    }
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    console.log(lawyers.length);
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className(""))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getEmail() {
    const emailElement = await driver
      .findElement(By.className(""))
      .getAttribute("href");


    return emailElement
  }


  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Brazil",
    };
  }

}

module.exports = LBCA;

async function main() {
  t = new LBCA();
  await t.accessPage(0);
  await t.accessPage(1);
  // await t.searchForLawyers();
}

main();
