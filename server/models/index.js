const blueprint = require('./blueprint');
const lib = require('./lib');
const model = require('./model');

module.exports = (options = {}) => {
    const models = {
        Blueprint: blueprint(options), Lib: lib(options), Model: model(options)
    }

    // 这里写关联关系
    models.Model.belongsTo(models.Lib, {
        foreignKey: 'libId'
    });

    return models;
};
