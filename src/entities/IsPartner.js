class IsPartner {

    /**
     * Checks if the lawyer element contains the role 'partner' using class name.
     *
     * @param {WebElement} lawyer the WebElement representing the lawyer.
     * @param {string} className the class name to locate the role element.
     * @returns {boolean} true if the role contains 'partner', false otherwise.
     */
    async byClassName(lawyer, className) {
        try {
            const role = await lawyer
                .findElement(By.className(className))
                .getText();
            return role.trim().toLowerCase().includes("partner");
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if the lawyer element contains the role 'partner' using XPath.
     *
     * @param {WebElement} lawyer the WebElement representing the lawyer.
     * @param {string} xPath the XPath expression to locate the role element.
     * @returns {boolean} true if the role contains 'partner', false otherwise.
     */
    async byXPath(lawyer, xPath) {
        try {
            const role = await lawyer
                .findElement(By.xpath(xPath))
                .getText();
            return role.trim().toLowerCase().includes("partner");
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if the lawyer element contains the role 'partner' using ID.
     *
     * @param {WebElement} lawyer the WebElement representing the lawyer.
     * @param {string} id the id of the element to locate the role.
     * @returns {boolean} true if the role contains 'partner', false otherwise.
     */
    async byId(lawyer, id) {
        try {
            const role = await lawyer
                .findElement(By.id(id))
                .getText();
            return role.trim().toLowerCase().includes("partner");
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if the lawyer element contains the role 'partner' using CSS selector.
     *
     * @param {WebElement} lawyer the WebElement representing the lawyer.
     * @param {string} cssSelector the CSS selector to locate the role element.
     * @returns {boolean} true if the role contains 'partner', false otherwise.
     */
    async byCss(lawyer, cssSelector) {
        try {
            const role = await lawyer
                .findElement(By.cssSelector(cssSelector))
                .getText();
            return role.trim().toLowerCase().includes("partner");
        } catch (e) {
            return false;
        }
    }
}

module.exports = IsPartner;
