'use strict';

const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Channel = loader.database.define('channels', {
  // Model attributes are defined here
  channelId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  channelName: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Channel;