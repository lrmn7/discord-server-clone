function mapPermissions(overwrites, source, target, roleMap) {
    return overwrites
        .map(overwrite => {
            let id;

            if (overwrite.type === 'role') {
                if (overwrite.id === source.id) {
                    id = target.id;
                } else {
                    id = roleMap.get(overwrite.id);
                }
            } else {
                id = overwrite.id;
            }

            if (!id) return null;

            return {
                id,
                allow: overwrite.allow || 0,
                deny: overwrite.deny || 0
            };
        })
        .filter(permission => permission !== null);
}

module.exports = {
    mapPermissions
};