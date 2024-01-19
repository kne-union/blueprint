const blueprint = require('./blueprint');
const lib = require('./lib');
const model = require('./model');
const element = require('./element');
const elementDependencies = require('./elementDependencies');

module.exports = (options = {}) => {
    const models = {
        Blueprint: blueprint(options),
        Lib: lib(options),
        Model: model(options),
        Element: element(options),
        ElementDependencies: elementDependencies(options)
    }

    // 这里写关联关系
    models.Model.belongsTo(models.Lib, {
        foreignKey: 'libId'
    });

    models.Element.hasMany(models.ElementDependencies, {
        foreignKey: 'elementId'
    });

    models.ElementDependencies.belongsTo(models.Element, {
        foreignKey: 'dependenceId'
    });

    return models;
};
