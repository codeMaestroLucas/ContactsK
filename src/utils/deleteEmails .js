const { constructFirms } = require("./constructLawFirms");
const fs = require("fs/promises");

async function deleteEmails() {
    try {
        const lawFirms = await Promise.all(constructFirms());
        
        for (let firm of lawFirms) {
            if (firm.emailsOfMonthPath) {
                try {
                    await fs.unlink(firm.emailsOfMonthPath);
                } catch (err) {
                    console.error(`Failed to delete ${firm.emailsOfMonthPath}: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error constructing firms: ${err.message}`);
    }
}

deleteEmails();
