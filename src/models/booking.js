'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.hasOne(models.PatientInfo, { foreignKey: 'bookingId' });
            Booking.belongsTo(models.User, { foreignKey: 'patientId' });
            Booking.belongsTo(models.Schedule, { foreignKey: 'scheduleId' })
            Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' })
        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        patientId: DataTypes.INTEGER,
        scheduleId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};