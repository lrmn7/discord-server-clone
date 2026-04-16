const colors = require('colors');
const { mapPermissions } = require('../utils/permissions');

async function createChannelSafe(guild, name, type, permissions) {
    // Prefer GuildChannelManager#create when available to avoid deprecation warnings.
    if (guild.channels && typeof guild.channels.create === 'function') {
        return guild.channels.create(name, {
            type,
            permissionOverwrites: permissions
        });
    }

    return guild.createChannel(name, type, permissions);
}

async function withSuppressedChannelDeprecation(run) {
    const originalEmitWarning = process.emitWarning;

    process.emitWarning = function patchedEmitWarning(warning, ...args) {
        const message = typeof warning === 'string'
            ? warning
            : warning && warning.message;

        if (typeof message === 'string' && message.includes('Guild#createChannel')) {
            return;
        }

        return originalEmitWarning.call(process, warning, ...args);
    };

    try {
        return await run();
    } finally {
        process.emitWarning = originalEmitWarning;
    }
}

async function cloneChannels(source, target, roleMap, { log, createProgressBar, delay, config }) {
    const categories = source.channels
        .filter(channel => channel.type === 'category')
        .sort((a, b) => a.position - b.position)
        .array();

    const textChannels = source.channels
        .filter(channel => channel.type === 'text')
        .sort((a, b) => a.position - b.position)
        .array();

    const voiceChannels = source.channels
        .filter(channel => channel.type === 'voice')
        .sort((a, b) => a.position - b.position)
        .array();

    const totalChannels = categories.length + textChannels.length + voiceChannels.length;
    if (totalChannels === 0) return;

    log(`Cloning ${colors.yellow(totalChannels)} channels...`, 'progress');
    const channelBar = createProgressBar('Creating Channels');
    channelBar.start(totalChannels, 0);

    const categoryMap = new Map();

    await withSuppressedChannelDeprecation(async () => {
        for (const category of categories) {
            try {
                const permissions = mapPermissions(
                    category.permissionOverwrites.array(),
                    source,
                    target,
                    roleMap
                );

                const newCategory = await createChannelSafe(target, category.name, 'category', permissions);
                categoryMap.set(category.id, newCategory.id);
            } catch (error) {
                log(`Failed to create category: ${category.name}`, 'warning');
            }

            channelBar.increment();
            await delay(config.delays.channel);
        }

        for (const channel of textChannels) {
            try {
                const permissions = mapPermissions(
                    channel.permissionOverwrites.array(),
                    source,
                    target,
                    roleMap
                );

                const newChannel = await createChannelSafe(target, channel.name, 'text', permissions);

                if (channel.parent && categoryMap.has(channel.parent.id)) {
                    await newChannel.setParent(categoryMap.get(channel.parent.id));
                }

                if (channel.topic) {
                    await newChannel.setTopic(channel.topic);
                }

                if (channel.nsfw) {
                    await newChannel.setNSFW(true);
                }
            } catch (error) {
                log(`Failed to create channel: ${channel.name}`, 'warning');
            }

            channelBar.increment();
            await delay(config.delays.channel);
        }

        for (const channel of voiceChannels) {
            try {
                const permissions = mapPermissions(
                    channel.permissionOverwrites.array(),
                    source,
                    target,
                    roleMap
                );

                const newChannel = await createChannelSafe(target, channel.name, 'voice', permissions);

                if (channel.parent && categoryMap.has(channel.parent.id)) {
                    await newChannel.setParent(categoryMap.get(channel.parent.id));
                }

                if (channel.bitrate) {
                    await newChannel.setBitrate(Math.min(channel.bitrate, 96000));
                }

                if (channel.userLimit) {
                    await newChannel.setUserLimit(channel.userLimit);
                }
            } catch (error) {
                log(`Failed to create voice channel: ${channel.name}`, 'warning');
            }

            channelBar.increment();
            await delay(config.delays.channel);
        }
    });

    channelBar.stop();
    console.log('');
}

module.exports = {
    cloneChannels
};