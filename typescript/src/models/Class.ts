import sequelize from '../config/database';

const { Sequelize, DataTypes, Model } = require('sequelize');

class Class extends Model {}

Class.init(
  {
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Class', // We need to choose the model name
  }
);

export default Class;
