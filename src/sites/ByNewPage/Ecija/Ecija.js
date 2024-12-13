const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Ecija extends ByNewPage {
  constructor(
    name = "Ecija",
    link = "https://ecija.com/en/partners-2/",
    totalPages = 20,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    if (index === 0 ) {
      await super.accessPage(index);
      await super.rollDown(1, 0.5);
      return
    }
    try {
      const nextBtn = await driver.wait(
        until.elementLocated(
          By.css('.page-item .next')
        ), 2000
      );
      await nextBtn.click();
      await super.rollDown(1, 1);
    } catch (err) {}
}


  async getLawyersInPage() {
    const lawyersDiv = await driver.wait(
      until.elementLocated(
        By.className("grid__container row")
      ), 100000
    );
    return await lawyersDiv.findElements(By.css("article"));
  }

  
  async openNewTab(lawyer) {
    let link = "";
    try {
      link = await lawyer
        .findElement(By.className("grid__item__header"))
        .findElement(By.css("a"))
        .getAttribute("href");
    } catch (error) {}
      // Some lawyers have the structure but no data

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.css("h1"))
      .getText();
  }

  async #getSocials() {
    let email = null;
    let ddd = null;

    try {
        const html = await driver
            .findElement(By.className("col-12 col-md-4 desc-abogado wow fadeInRightBig"))
            .findElement(By.className("info"))
            .findElement(By.css("p:last-child"))
            .getAttribute("outerHTML");

        const values = html.split("<br>").map(value => value.trim());

        for (const value of values) {
            if (!email && (value.includes("@adcecija") || value.includes("@ecija"))) {
                const regex = /(?:mailto:)?([\w.-]+@[a-zA-Z.-]+\.[a-zA-Z]+)/;
                const match = regex.exec(value);
                if (match) email = match[1]; // Extract the email
                
            } else if (!ddd) {
                const phoneNumber = value.replace(/\D/g, '');
                if (phoneNumber.length > 8) {
                    ddd = phoneNumber;
                }
            }

            if (email && ddd) break;
        }
        // Fallback for cases where email is inside <a> tags
        if (!email) {
            try {
                const regex = /<a[^>]*href=["']mailto:([^"']+)["'][^>]*>(?:<[^>]+>)*([^<]+)(?:<\/[^>]+>)*<\/a>/g;
                let match;
                while ((match = regex.exec(html)) !== null) {
                    email = match[1] || match[2];
                }
            } catch (error) {
                console.error("Error in fallback email extraction:", error);
            }
        }
        return { email, ddd };

    } catch (error) {
        console.error("Error in #getSocials:", error);
        return { email, ddd };
    }
}


  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials();
    return {
      name: await this.#getName(),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = Ecija;
