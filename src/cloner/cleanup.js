const colors = require('colors');

async function deleteGuildContent(guild, { log, createProgressBar, delay }, ignoredChannels = []) {
    log(`Cleaning target server: ${colors.yellow(guild.name)}`, 'progress');

    const channels = guild.channels.array();
    const roles = guild.roles.filter(role => role.id !== guild.id && !role.managed).array();

    if (channels.length > 0) {
        const channelBar = createProgressBar('Deleting Channels');
        channelBar.start(channels.length, 0);

        for (const channel of channels) {
            if (ignoredChannels.includes(channel.id)) {
                continue;
            }

            try {
                await channel.delete();
            } catch (error) {}

            channelBar.increment();
            await delay(100);
        }

        channelBar.stop();
    }

    if (roles.length > 0) {
        const roleBar = createProgressBar('Deleting Roles   ');
        roleBar.start(roles.length, 0);

        for (const role of roles) {
            try {
                await role.delete();
            } catch (error) {}

            roleBar.increment();
            await delay(100);
        }

        roleBar.stop();
    }

    console.log('');
}

module.exports = {
    deleteGuildContent
};