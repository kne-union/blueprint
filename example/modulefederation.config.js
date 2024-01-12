const {moduleFederationConfig} = require("@kne/modules-dev");
const merge = require('lodash/merge');

module.exports = merge({}, moduleFederationConfig, {
    shared: {
        "@kne/blueprint": {
            singleton: true, requiredVersion: false
        }
    }
});
