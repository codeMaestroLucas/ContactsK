const Excel = require('./Excel');

class Contacts extends Excel {
    constructor(filePath= 'src/baseFiles/excel/Contacts.xlsx') {
        super(filePath);
    }

    /**
     * Function used to search an email in the Contacts.xlsx file.
     *
     * The data from the emailToSearch and all the email in the file are treated.
     * @param {string} emailToSearch - an email that will be searched
     * @returns {boolean}
     */
    emailInContacts(emailToSearch) {
        emailToSearch = emailToSearch.trim().toLowerCase();
        const rows = this.getWorksheet().slice(1); // Skip the header

        for (const row of rows) {
            if (row[0]?.trim().toLowerCase() === emailToSearch) {
                // This "row[0]?" make sure that the cell isn't empty
                return true;
            }
        }
        return false;
    }
}

module.exports = Contacts;
