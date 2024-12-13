const getFirms = require('./src/utils/interface');

/**
 * Runs the main code
 */
async function main() {
    await getFirms();
}


main().catch((error) => {
    console.error('Error in main:', error);
});
