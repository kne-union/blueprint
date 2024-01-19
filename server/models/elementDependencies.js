const {DataTypes} = require('sequelize');

module.exports = ({sequelize}) => {
    return sequelize.define('ElementDependencies', {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        }, elementId: {
            type: DataTypes.STRING, allowNull: false
        }, dependenceId: {
            type: DataTypes.STRING, allowNull: false
        }
    }, {});
};
