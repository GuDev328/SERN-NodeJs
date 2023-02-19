'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('patientInfos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            bookingId: {
                type: Sequelize.INTEGER,
            },

            name: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING
            },
            dob: {
                type: Sequelize.DATEONLY,
            },
            phoneNumber: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            reason: {
                type: Sequelize.STRING
            },


            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('patientInfos');
    }
};