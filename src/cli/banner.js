const figlet = require('figlet');
const gradient = require('gradient-string');
const colors = require('colors');

const rainbowGradient = gradient.rainbow;

function displayBanner(config) {
    console.clear();
    const banner = figlet.textSync('lrmn7', {
        font: 'ANSI Shadow',
        horizontalLayout: 'fitted'
    });

    console.log(rainbowGradient(banner));
    console.log('');
    console.log(colors.magenta('━'.repeat(70)));
    console.log(`   ${colors.gray('Version:')} ${colors.cyan(config.version)}   ${colors.gray('|')}   ${colors.gray('By:')} ${colors.magenta(config.author)}   ${colors.gray('|')}   ${colors.gray('GitHub:')} ${colors.blue(config.github)}`);
    console.log(colors.magenta('━'.repeat(70)));
    console.log('');
}

module.exports = {
    displayBanner
};