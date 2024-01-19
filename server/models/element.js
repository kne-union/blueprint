const {DataTypes} = require('sequelize');

module.exports = ({sequelize}) => {
    return sequelize.define('Element', {
        id: {
            type: DataTypes.STRING, primaryKey: true
        }, name: {
            type: DataTypes.STRING, allowNull: false
        }, label: {
            type: DataTypes.STRING, allowNull: false
        }, address: {
            type: DataTypes.STRING, allowNull: false
        }, subElements: {
            type: DataTypes.JSON
        }, description: {
            type: DataTypes.TEXT
        }, args: {
            type: DataTypes.JSON
        }, apis: {
            type: DataTypes.JSON
        }, disabledAt: {
            type: DataTypes.DATE
        }
    }, {
        indexes: [{
            unique: true, fields: ['name']
        }, {
            unique: true, fields: ['label']
        }]
    });
};
