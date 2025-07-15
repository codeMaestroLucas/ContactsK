const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Szecskay extends ByNewPage {
  constructor(
    name = "Szecskay",
    link = "https://szecskay.com/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("elementor-element elementor-element-1535d861 e-con-full e-flex e-con e-child")
      ), 100000
    );

    const webRole = [
      By.className("elementor-element elementor-element-baa086d elementor-widget elementor-widget-post-info"),
      By.className("elementor-widget-container"),
      By.className("elementor-inline-items elementor-icon-list-items elementor-post-info"),
      By.className("elementor-icon-list-item elementor-repeater-item-8039d42 elementor-inline-item"),
      By.className("elementor-post-info__terms-list-item")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("elementor-heading-title elementor-size-default"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.xpath('//*[@id="content"]/div/div/div[1]/div/div[2]/div/div/div/div/div/div[2]/div/div/ul/li[1]/span[2]'))
      .getText();
  }


  async #getPhone() {
    return await driver
      .findElement(By.xpath('//*[@id="content"]/div/div/div[1]/div/div[2]/div/div/div/div/div/div[2]/div/div/ul/li[2]/span[2]'))
      .getText();
  }

  
  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: await this.#getPhone(),
      country: "Hungary",
    };
  }
}

module.exports = Szecskay;
