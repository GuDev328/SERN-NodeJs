'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PatientInfo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PatientInfo.belongsTo(models.Booking, { foreignKey: 'bookingId' });
            PatientInfo.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderPatientData' })
        }
    };
    PatientInfo.init({
        bookingId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        dob: DataTypes.DATEONLY,
        address: DataTypes.STRING,
        reason: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'PatientInfo',
    });
    return PatientInfo;
};