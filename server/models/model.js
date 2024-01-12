const {DataTypes} = require('sequelize');

module.exports = ({sequelize}) => {
    return sequelize.define('Model', {
        id: {
            type: DataTypes.STRING, primaryKey: true
        }, name: {
            type: DataTypes.STRING, allowNull: false
        }, label: {
            type: DataTypes.STRING, allowNull: false
        }, libId: {
            type: DataTypes.STRING, allowNull: false
        }, description: {
            type: DataTypes.TEXT
        }, fields: {
            type: DataTypes.JSON, allowNull: false
        }, disabledAt: {
            type: DataTypes.DATE
        }
    }, {});
};
