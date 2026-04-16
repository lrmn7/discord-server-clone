const cliProgress = require('cli-progress');
const colors = require('colors');

function createProgressBar(name) {
    return new cliProgress.SingleBar({
        format: `   ${colors.cyan(name)} |${colors.cyan('{bar}')}| {percentage}% | {value}/{total}`,
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true
    });
}

module.exports = {
    createProgressBar
};