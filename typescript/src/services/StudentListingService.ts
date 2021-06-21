import Logger from '../config/logger';
import api from '../config/api';
import { Op } from 'sequelize';
import Student from 'models/Student';
import Class from 'models/Class';
import TeacherStudentClassSubjectMapping from 'models/TeacherStudentClassSubjectMapping';
import { StudentListingResponse } from 'types/StudentListingResponse';

const { MAX_STUDENTS_PER_CLASS = 500 } = process.env;

const LOG = new Logger('StudentListingService.js');

const validateStudentListingRequest = (
  reqClassCode: string,
  reqOffset: string,
  reqLimit: string
): void => {
  // Validating all parameters to be mandatory
  if (!reqClassCode || !reqOffset || !reqLimit) {
    LOG.error(
      'Validation failed for StudentListing API Query Parameters. There are parameters with empty value.'
    );
    throw new Error('BAD_REQUEST');
  }
  // Validating offset and limit to be integar parseable
  if (isNaN(Number(reqOffset))) {
    LOG.error(
      'Validation failed for StudentListing API Query Parameters. offset value is invalid.'
    );
    throw new Error('BAD_REQUEST');
  }
  if (isNaN(Number(reqLimit))) {
    LOG.error(
      'Validation failed for StudentListing API Query Parameters. limit value is invalid.'
    );
    throw new Error('BAD_REQUEST');
  }

  return;
};

export const retrieveStudentsByClassCode = async (
  reqClassCode: string,
  reqOffset: string,
  reqLimit: string
): Promise<StudentListingResponse> => {
  // For Troubleshooting only
  // LOG.info(`reqClassCode: ${reqClassCode}, reqOffset: ${reqOffset}, reqLimit: ${reqLimit}`);

  validateStudentListingRequest(reqClassCode, reqOffset, reqLimit);

  // Retrieve all External Students in the class as we need to merge with Local Students
  let externalClassStudentMapping;
  let externalClassStudentMappingData;
  try {
    externalClassStudentMapping = await api.get(
      `http://localhost:5000/students?class=${reqClassCode}&offset=0&limit=${MAX_STUDENTS_PER_CLASS}`
    );
    externalClassStudentMappingData = externalClassStudentMapping.data;

    // Handling Edge Scenario
    if (externalClassStudentMappingData.count > MAX_STUDENTS_PER_CLASS) {
      LOG.info(
        `External Students more than MAX_STUDENTS_PER_CLASS: ${MAX_STUDENTS_PER_CLASS}, fetch again with new limit.`
      );
      externalClassStudentMapping = await api.get(
        `http://localhost:5000/students?class=${reqClassCode}&offset=0&limit=${externalClassStudentMappingData.count}`
      );
      externalClassStudentMappingData = externalClassStudentMapping.data;
    }
  } catch (error) {
    LOG.error('External Student Listing API is unavailable');
    throw new Error('SERVICE_UNAVAILABLE');
  }

  // For Troubleshooting only
  // LOG.info(JSON.stringify(externalClassStudentMappingData));

  // Retrieve all Local Students in the class
  const localClassStudentMappingData =
    await TeacherStudentClassSubjectMapping.findAndCountAll({
      attributes: [],
      where: {
        active: {
          [Op.eq]: true,
        },
      },
      include: [
        {
          model: Class,
          attributes: [],
          where: {
            code: {
              [Op.eq]: reqClassCode,
            },
          },
        },
        {
          model: Student,
          attributes: ['id', 'email', 'name'],
        },
      ],
    });

  // For Troubleshooting only
  // LOG.info(JSON.stringify(localClassStudentMappingData));

  // Merge External Students and Local Students for sorting
  const mergedStudents: Student[] = [];
  for (const externalStudent of externalClassStudentMappingData.students) {
    mergedStudents.push({
      id: externalStudent.id,
      name: externalStudent.name,
      email: externalStudent.email,
      group: 'external',
    });
  }
  for (const localStudent of localClassStudentMappingData.rows) {
    mergedStudents.push({
      id: localStudent.Student.id,
      name: localStudent.Student.name,
      email: localStudent.Student.email,
      group: 'local',
    });
  }
  mergedStudents.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
  const searchedStudents: Student[] = mergedStudents.slice(
    parseInt(reqOffset),
    parseInt(reqOffset) + parseInt(reqLimit)
  );

  const studentListingResponse: StudentListingResponse = {};
  studentListingResponse.count =
    externalClassStudentMappingData.count + localClassStudentMappingData.count;
  studentListingResponse.students = searchedStudents;

  return studentListingResponse;
};
