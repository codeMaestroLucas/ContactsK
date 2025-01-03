
const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LBCA extends ByNewPage {
  constructor(
    name = "LBCA",
    link = "https://lbca.com.br/equipe/",
    totalPages = 6,
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    if (index === 0 ) {
      await super.accessPage(index);

      const addBtn = await driver.wait(
        until.elementLocated(By.id("adopt-accept-all-button")
        ), 5000
      );
      await addBtn.click();

      await driver
        .findElement(By.name('_cargos-profissionais'))
        .findElement(By.css("option:last-child"))
        .click();
    } else {
      const loadMoreBtn = await driver
        .findElement(By.className("jet-filters-pagination"))
        .findElement(By.className("jet-filters-pagination__item prev-next next"));

      const actions = driver.actions();
      //! The hover prevents the click from the block
      await actions.move({ origin: loadMoreBtn }).perform();

      await new Promise(resolve => setTimeout(resolve, 300));

      await loadMoreBtn.click();
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }


  async getLawyersInPage() {
    const lawyersDiv = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="filtro-prof"]/div/div/div')
      ), 100000
    );
    return await lawyersDiv.findElements(By.className("jet-listing-grid__item jet-equal-columns"))
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className("jet-engine-listing-overlay-link"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.xpath('/html/body/main/div[3]/div[2]/div[1]/div/h2'))
      .getText() || "";
  }


  async #getEmail() {
    return await driver
      .findElement(By.xpath('/html/body/main/div[3]/div[2]/div[2]/div/ul/li/a'))
      .getAttribute("href");
  }


  
  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: '551121495400',
      country: "Brazil"
    };
  }
}

module.exports = LBCA;
