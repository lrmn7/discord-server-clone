const colors = require('colors');

async function cloneRoles(source, target, { log, createProgressBar, delay, config }) {
    const roles = source.roles
        .filter(role => role.id !== source.id)
        .sort((a, b) => a.position - b.position)
        .array();

    if (roles.length === 0) return new Map();

    log(`Cloning ${colors.yellow(roles.length)} roles...`, 'progress');
    const roleBar = createProgressBar('Creating Roles   ');
    roleBar.start(roles.length, 0);

    const roleMap = new Map();

    for (const role of roles) {
        try {
            const newRole = await target.createRole({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions,
                mentionable: role.mentionable
            });

            roleMap.set(role.id, newRole.id);
        } catch (error) {}

        roleBar.increment();
        await delay(config.delays.role);
    }

    roleBar.stop();

    log('Setting role positions...', 'progress');
    const posBar = createProgressBar('Setting Positions');
    posBar.start(roles.length, 0);

    for (const role of roles) {
        const targetRoleId = roleMap.get(role.id);

        if (targetRoleId) {
            try {
                const targetRole = target.roles.get(targetRoleId);
                await targetRole.setPosition(role.position);
            } catch (error) {
                log(`Failed to set position for ${role.name}`, 'warning');
            }
        }

        posBar.increment();
        await delay(200);
    }

    posBar.stop();
    console.log('');

    return roleMap;
}

module.exports = {
    cloneRoles
};