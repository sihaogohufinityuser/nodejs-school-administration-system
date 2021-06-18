import sequelize from '../config/database';

const { Sequelize, DataTypes, Model } = require('sequelize');

class Student extends Model {}

Student.init(
  {
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Student', // We need to choose the model name
  }
);

export default Student;
