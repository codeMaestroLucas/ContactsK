const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class SamvadPartners extends ByNewPage {
  constructor(
    name = "Samvad Partners",
    link = "https://www.samvadpartners.com/our-people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("mGoGm2")),
      100000
    );
  }


  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }


  async #getEmail(maxRetries = 20) {
    const H1tags = await driver.findElements(By.css("h1"));

    for (let i = 0; i < maxRetries; i++) {
      try {
        if (H1tags[i]) {
          const email = (await H1tags[i].getText()).replace("E: ", "");;

          if (this.#validateEmail(email)) {
            return email
          }

        }
      } catch (e) {
        continue;
      }
    }
    throw new Error("Failed to retrieve a valid email after retries.");
  }

  async #getPhone() {
    const H1tags = await driver.findElements(By.css("h1"));

    for (let h1 of H1tags) {
      const html = (await h1.getAttribute("outerHTML")).toLowerCase();
      const cleandText = html.replace(/<[^>]*>/g, "").trim();
      if (cleandText.includes("t: +")) return cleandText.replace(/\/.*/, "");
    }
  }
  

  #validateEmail(email) {
    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  async getLawyer(lawyer) {
    try {
      return {
        link: await driver.getCurrentUrl(),
        //! This site is terrible, let the name be catch later
        email: await this.#getEmail(),
        phone: await this.#getPhone(),
        country: "India"
      };
    } catch (e) {
      console.error("Error retrieving lawyer details:", e);
      return null;
    }
  }
}

module.exports = SamvadPartners;
