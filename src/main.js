const getFirms = require('./utils/interface');

/**
 * Runs the main code
 */
async function main() {
    await getFirms();
}


if (require.main === module) {
    
    main().catch((error) => {
        console.error('Error in main:', error);
    });
    
}


module.exports = main;
