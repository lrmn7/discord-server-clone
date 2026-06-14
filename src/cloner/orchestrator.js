const colors = require('colors');
const { deleteGuildContent } = require('./cleanup');
const { cloneRoles } = require('./roles');
const { cloneChannels } = require('./channels');

async function cloneServer(source, target, options, context) {
    const startTime = Date.now();

    context.displayBanner();
    context.log('Starting clone operation...', 'info');
    context.log(`Source: ${colors.green(source.name)} (${source.id})`, 'info');
    context.log(`Target: ${colors.yellow(target.name)} (${target.id})`, 'info');
    console.log('');

    await deleteGuildContent(target, context, options.ignoredChannels);

    if (options.cloneIcon && source.iconURL) {
        try {
            await target.setIcon(source.iconURL);
            context.log('Server icon cloned', 'success');
        } catch (error) {
            context.log('Failed to clone server icon', 'warning');
        }
    }

    if (options.cloneName) {
        try {
            await target.setName(source.name);
            context.log('Server name cloned', 'success');
        } catch (error) {
            context.log('Failed to clone server name', 'warning');
        }
    }

    console.log('');

    const roleMap = await cloneRoles(source, target, context);
    await cloneChannels(source, target, roleMap, context);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(colors.magenta('━'.repeat(70)));
    console.log('');
    context.log(`Clone completed successfully in ${colors.cyan(`${duration}s`)}!`, 'success');
    console.log('');

    const stats = {
        roles: source.roles.size - 1,
        channels: source.channels.size
    };

    console.log(`   ${colors.gray('Stats:')} ${colors.cyan(stats.roles)} roles | ${colors.cyan(stats.channels)} channels`);
    console.log('');
    console.log(colors.magenta('━'.repeat(70)));
    console.log(`   ${colors.magenta('Thank you for using L RMN Cloner!')} ${colors.gray('- Join the')} ${colors.cyan('support server')} ${colors.gray('for feedback and updates. https://discord.gg/rBRzcjExDY')}`);
    console.log(colors.magenta('━'.repeat(70)));
}

module.exports = {
    cloneServer
};