import sequelize from '../config/database';
import Teacher from './Teacher';
import Student from './Student';
import Class from './Class';
import Subject from './Subject';

const { Sequelize, DataTypes, Model } = require('sequelize');

class TeacherStudentClassSubjectMapping extends Model {}

TeacherStudentClassSubjectMapping.init(
  {
    teacherId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'TeacherStudentClassSubjectMapping', // We need to choose the model name
  }
);

TeacherStudentClassSubjectMapping.belongsTo(Teacher, {foreign_key: 'fk_TeacherStudentClassSubjectMapping_Teacher_teacherId_id', sourceKey: 'teacherId'});
TeacherStudentClassSubjectMapping.belongsTo(Student, {foreign_key: 'fk_TeacherStudentClassSubjectMapping_Student_studentId_id', sourceKey: 'teacherId'});
TeacherStudentClassSubjectMapping.belongsTo(Class, {foreign_key: 'fk_TeacherStudentClassSubjectMapping_Class_classId_id', sourceKey: 'teacherId'});
TeacherStudentClassSubjectMapping.belongsTo(Subject, {foreign_key: 'fk_TeacherStudentClassSubjectMapping_Subject_subjectId_id', sourceKey: 'teacherId'});

export default TeacherStudentClassSubjectMapping;
