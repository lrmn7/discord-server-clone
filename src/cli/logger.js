const colors = require('colors');

function createLogger() {
    return function log(message, type = 'info') {
        const timestamp = colors.gray(`[${new Date().toLocaleTimeString()}]`);
        const types = {
            success: { symbol: '✓', color: colors.green },
            warning: { symbol: '⚠', color: colors.yellow },
            error: { symbol: '✗', color: colors.red },
            info: { symbol: '→', color: colors.cyan },
            progress: { symbol: '◆', color: colors.magenta }
        };

        const { symbol, color } = types[type] || types.info;
        console.log(`${timestamp} ${color(`[${symbol}]`)} ${message}`);
    };
}

module.exports = {
    createLogger
};