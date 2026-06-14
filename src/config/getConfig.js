require('dotenv').config();
const colors = require('colors');

async function getConfig(displayBanner, log) {
    displayBanner();

    try {
        const token = process.env.DISCORD_TOKEN;
        const original = process.env.SOURCE_SERVER_ID;
        const target = process.env.TARGET_SERVER_ID;
        
        if (!token) throw new Error('DISCORD_TOKEN is missing in .env');
        if (!original) throw new Error('SOURCE_SERVER_ID is missing in .env');
        if (!target) throw new Error('TARGET_SERVER_ID is missing in .env');

        const config = {
            token,
            original,
            target,
            cloneIcon: process.env.CLONE_ICON !== 'false', // Default true
            cloneName: process.env.CLONE_NAME !== 'false', // Default true
            ignoredChannels: process.env.IGNORED_CHANNELS || ''
        };

        if (config.ignoredChannels) {
            config.ignoredChannels = config.ignoredChannels.split(',').map(id => id.trim()).filter(id => id);
        } else {
            config.ignoredChannels = [];
        }

        return config;
    } catch (err) {
        log(`Config Error: ${err.message}`, 'error');
        log('Please make sure you have created a .env file based on .env.example', 'warning');
        process.exit(1);
    }
}

module.exports = {
    getConfig
};