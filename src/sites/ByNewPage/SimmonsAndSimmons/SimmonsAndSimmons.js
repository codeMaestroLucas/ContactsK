const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class SimmonsAndSimmons extends ByNewPage {
  constructor(
    name = "Simmons And Simmons",
    link = "https://www.simmons-simmons.com/en/people?query=&filters=false&type=partners&sectors=&services=&office=#noScroll",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
    try {
      await driver.findElement(By.xpath('//*[@id="website"]/div[2]/section/div[2]/button[1]')).click();
    } catch (e) {}
    await new Promise(resolve => setTimeout(resolve, 10000));
    // Slow site
    await this.rollDown(20, 0.2);
    // 258 rolls
    // Each roll add 3 lawyers
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("contact-card contact-card--offset-top contact-card-offset--16-9 contact-card--background-image")
      ), 10000
    );
  }

  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }

  async #getName() {
    try {
      const nameElement = await driver.wait(
        until.elementLocated(
          By.className("content content--small space-no-spacing")
        ), 10000
      );
      const html = await nameElement
        .findElement(By.css("h1"))
        .getAttribute("outerHTML");
  
      const regex = /<h1>\s*([\w\s]+)<br>\s*([\w\s]+)\s*<\/h1>/;
      const match = html.match(regex);
  
      let fullName;
      if (match) {
        fullName = match[1].trim() + " " + match[2].trim();
      }
      return fullName;
    } catch (error) {}
  }

  async #getEmail() {
    try {
      const emailElement = await driver.wait(
        until.elementLocated(
          By.className("col--secondary space-sm mobile-primary")
        ), 10000
      );
      return (await emailElement
        .findElement(By.css("a"))
        .getAttribute("href"))
        .replace("mailto:", "");
  
    } catch (error) {}
  }

  async #getDDD() {
    try {
      const dddElement = await driver.wait(
        until.elementLocated(
          By.className("col--secondary space-sm mobile-primary")
        ), 10000
      );
      return await dddElement
        .findElement(By.css("div"))
        .getText();
    } catch (error) {}
  }

  async getLawyer() {
      return {
        name: await this.#getName(),
        email: await this.#getEmail(),
        country: getCountryByDDD(await this.#getDDD()),
      };
    }
  }

module.exports = SimmonsAndSimmons;
