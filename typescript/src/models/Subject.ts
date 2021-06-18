import sequelize from '../config/database';

const { Sequelize, DataTypes, Model } = require('sequelize');

class Subject extends Model {}

Subject.init(
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
    modelName: 'Subject', // We need to choose the model name
  }
);

export default Subject;
