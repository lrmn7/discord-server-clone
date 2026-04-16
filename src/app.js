const { Client } = require('discord.js-selfbot-v11');
const colors = require('colors');
const { displayBanner } = require('./cli/banner');
const { createLogger } = require('./cli/logger');
const { createProgressBar } = require('./cli/progress');
const { getConfig } = require('./config/getConfig');
const { delay } = require('./utils/delay');
const { cloneServer } = require('./cloner/orchestrator');

const CONFIG = {
    version: '1.0.0',
    author: 'lrmn7',
    github: 'github.com/lrmn7',
    delays: {
        role: 500,
        channel: 800,
        emoji: 1000
    }
};

function createApp() {
    const client = new Client();
    const log = createLogger();

    async function run() {
        try {
            const config = await getConfig(() => displayBanner(CONFIG), log);
            const { token, original, target, cloneIcon, cloneName } = config;

            displayBanner(CONFIG);
            log('Connecting to Discord...', 'info');

            client.on('ready', async () => {
                const sourceGuild = client.guilds.get(original);
                const targetGuild = client.guilds.get(target);

                if (!sourceGuild) {
                    log(`Source server not found! Make sure you're a member of the server.`, 'error');
                    process.exit(1);
                }

                if (!targetGuild) {
                    log(`Target server not found! Make sure you're a member and have admin permissions.`, 'error');
                    process.exit(1);
                }

                log(`Logged in as ${colors.cyan(client.user.tag)}`, 'success');
                console.log('');

                await cloneServer(
                    sourceGuild,
                    targetGuild,
                    { cloneIcon, cloneName },
                    {
                        config: CONFIG,
                        delay,
                        displayBanner: () => displayBanner(CONFIG),
                        log,
                        createProgressBar
                    }
                );

                setTimeout(() => process.exit(0), 2000);
            });

            client.on('error', error => {
                log(`Discord error: ${error.message}`, 'error');
            });

            await client.login(token.replace(/"/g, ''));
        } catch (error) {
            if (error.message && error.message.includes('Incorrect login')) {
                displayBanner(CONFIG);
                log('Invalid token! Please check your Discord token and try again.', 'error');
            } else {
                log(`Error: ${error.message}`, 'error');
            }

            process.exit(1);
        }
    }

    return {
        run
    };
}

module.exports = {
    createApp
};