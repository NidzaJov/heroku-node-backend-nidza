const helpers = {};

helpers.validateKeysExist = (keys = [], target) => {
    for (const key of keys) {
        if (typeof target[key] === 'undefined') {
            throw `Validation error for key ${key}`;
        }
    }
}

module.exports = helpers;