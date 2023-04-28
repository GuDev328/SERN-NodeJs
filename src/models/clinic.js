'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Clinic.init({
        name: DataTypes.STRING,
        contentHTML: DataTypes.TEXT,
        contentMarkdown: DataTypes.TEXT,
        address: DataTypes.STRING,
        avt: DataTypes.BLOB,
        image: DataTypes.BLOB,

    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};