const { prompt } = require('enquirer');
const colors = require('colors');

async function getConfig(displayBanner, log) {
    displayBanner();

    try {
        const config = await prompt([
            {
                type: 'password',
                name: 'token',
                message: colors.cyan('Enter your Discord token'),
                validate: value => value.length > 50 ? true : 'Token seems too short. Please check again.'
            },
            {
                type: 'input',
                name: 'original',
                message: colors.cyan('Enter the source server ID (to clone from)'),
                validate: value => /^\d{17,19}$/.test(value) ? true : 'Invalid server ID format'
            },
            {
                type: 'input',
                name: 'target',
                message: colors.cyan('Enter the target server ID (to clone to)'),
                validate: value => /^\d{17,19}$/.test(value) ? true : 'Invalid server ID format'
            },
            {
                type: 'confirm',
                name: 'cloneIcon',
                message: colors.cyan('Clone server icon?'),
                initial: true
            },
            {
                type: 'confirm',
                name: 'cloneName',
                message: colors.cyan('Clone server name?'),
                initial: true
            }
        ]);

        return config;
    } catch (err) {
        if (err.message && err.message.includes('cancelled')) {
            log('Operation cancelled by user', 'warning');
            process.exit(0);
        }

        throw err;
    }
}

module.exports = {
    getConfig
};