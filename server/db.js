const {Sequelize} = require('sequelize');
const models = require('./models');
module.exports = (config) => {
    const sequelize = new Sequelize(Object.assign({}, {
        dialect: 'sqlite'
    }, config));

    (async () => {
        await sequelize.sync({force:true});
        console.log('sequelize start!');
    })();

    return models({sequelize});
};
