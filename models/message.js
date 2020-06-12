'use strict';

const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Message = loader.database.define('messages', {
  // Model attributes are defined here
  messageId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  postedBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  channelId: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      fields: ['postedBy', 'channelId']
    }
  ]
});

module.exports = Message;