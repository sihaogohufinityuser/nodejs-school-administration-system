import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import { CsvItem } from 'types/CsvItem';
import Logger from '../config/logger';
import { Op, Sequelize } from 'sequelize';
import Teacher from 'models/Teacher';
import Student from 'models/Student';
import Class from 'models/Class';
import Subject from 'models/Subject';
import { CsvMappingTable } from 'types/CsvMappingTable';
import { MappingTable } from 'types/MappingTable';
import TeacherStudentClassSubjectMapping from 'models/TeacherStudentClassSubjectMapping';
import { StudentListingResponse } from 'types/StudentListingResponse';
import { WorkloadReportResponse } from 'types/WorkloadReportResponse';

const { MAX_STUDENTS_PER_CLASS = 500 } = process.env;

const LOG = new Logger('util.js');
axios.interceptors.request.use(
  (request) => {
    LOG.info(`Sending API Request to ${request.url}`);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const convertCsvToJson = (filePath: string): Promise<CsvItem[]> => {
  const results: CsvItem[] = [];
  const stream = fs.createReadStream(filePath).pipe(csv());

  return new Promise((resolve, reject) => {
    stream.on('data', (data: CsvItem) => results.push(data));
    stream.on('end', () => resolve(results));
    stream.on('error', (err) => reject(err));
  });
};

const validateDataItem = (
  dataItem: CsvItem,
  mappingDuplicateCheck?: string[]
): void => {
  // Validating all fields to be mandatory
  if (
    !dataItem.teacherEmail ||
    !dataItem.teacherName ||
    !dataItem.studentEmail ||
    !dataItem.studentName ||
    !dataItem.classCode ||
    !dataItem.classname ||
    !dataItem.subjectCode ||
    !dataItem.subjectName ||
    dataItem.toDelete === ''
  ) {
    LOG.error(
      'Validation failed for file in the request. There are fields with empty value.'
    );
    throw new Error('BAD_REQUEST');
  }
  // Validating toDelete field to be either 0 or 1
  if (
    isNaN(Number(dataItem.toDelete)) ||
    ![0, 1].includes(Number(dataItem.toDelete))
  ) {
    LOG.error(
      'Validation failed for file in the request. Only 0 or 1 is accepted for toDelete field.'
    );
    throw new Error('BAD_REQUEST');
  }

  // Validating that there are no duplicate records based on combination of teacherEmail, studentEmail, classCode, subjectCode
  if (
    mappingDuplicateCheck.includes(
      `${dataItem.teacherEmail}|${dataItem.studentEmail}|${dataItem.classCode}|${dataItem.subjectCode}`
    )
  ) {
    LOG.error(
      'Validation failed for file in the request. Duplicate records based on teacherEmail, studentEmail, classCode, subjectCode.'
    );
    throw new Error('BAD_REQUEST');
  }
  mappingDuplicateCheck.push(
    `${dataItem.teacherEmail}|${dataItem.studentEmail}|${dataItem.classCode}|${dataItem.subjectCode}`
  );

  return;
};

export const validateAndPopulateDataObjectsFromJson = (
  data: CsvItem[]
): [
  Map<string, Teacher>,
  Map<string, Student>,
  Map<string, Class>,
  Map<string, Subject>,
  CsvMappingTable[]
] => {
  const csvTeachers: Map<string, Teacher> = new Map();
  const csvStudents: Map<string, Student> = new Map();
  const csvClasses: Map<string, Class> = new Map();
  const csvSubjects: Map<string, Subject> = new Map();
  const csvMappings: CsvMappingTable[] = [];
  const mappingDuplicateCheck: string[] = [];
  for (const dataItem of data) {
    // For Troubleshooting only
    // LOG.info(JSON.stringify(dataItem));
    validateDataItem(dataItem, mappingDuplicateCheck);

    csvTeachers.set(dataItem.teacherEmail, {
      email: dataItem.teacherEmail,
      name: dataItem.teacherName,
    });
    csvStudents.set(dataItem.studentEmail, {
      email: dataItem.studentEmail,
      name: dataItem.studentName,
    });
    csvClasses.set(dataItem.classCode, {
      code: dataItem.classCode,
      name: dataItem.classname,
    });
    csvSubjects.set(dataItem.subjectCode, {
      code: dataItem.subjectCode,
      name: dataItem.subjectName,
    });
    csvMappings.push({
      teacherEmail: dataItem.teacherEmail,
      studentEmail: dataItem.studentEmail,
      classCode: dataItem.classCode,
      subjectCode: dataItem.subjectCode,
      toDelete: Number(dataItem.toDelete),
    });
  }
  return [csvTeachers, csvStudents, csvClasses, csvSubjects, csvMappings];
};

export const updateOrInsertDataObjects = async (
  dataObjects: [
    Map<string, Teacher>,
    Map<string, Student>,
    Map<string, Class>,
    Map<string, Subject>,
    CsvMappingTable[]
  ]
): Promise<void> => {
  // Object to store ID of queried Teacher, Student, Class, Subject records
  const idMappingTable: MappingTable = {
    Teacher: new Map(),
    Student: new Map(),
    Class: new Map(),
    Subject: new Map(),
  };

  // Teacher
  const csvTeachers = dataObjects[0].values();
  for (const csvTeacher of csvTeachers) {
    const existingTeacher: Teacher = await Teacher.findOne({
      where: {
        email: {
          [Op.eq]: csvTeacher.email,
        },
      },
    });

    // For Troubleshooting only
    // LOG.info('existingTeacher:' + JSON.stringify(existingTeacher));
    // LOG.info('csvTeacher:' + JSON.stringify(csvTeacher));

    if (existingTeacher) {
      LOG.info(`Teacher found in DB: ${existingTeacher.email}`);
      idMappingTable.Teacher.set(existingTeacher.email, existingTeacher.id);
      if (existingTeacher.name !== csvTeacher.name) {
        LOG.info(
          `Teacher found in DB: ${existingTeacher.email} has a new name to update: ${existingTeacher.name} to ${csvTeacher.name}`
        );
        existingTeacher.name = csvTeacher.name;
        await existingTeacher.save();
      }
    } else {
      LOG.info(`Teacher NOT found in DB: ${csvTeacher.email}. Adding...`);
      const newTeacher = Teacher.build({
        email: csvTeacher.email,
        name: csvTeacher.name,
      });
      await newTeacher.save();
      idMappingTable.Teacher.set(newTeacher.email, newTeacher.id);
    }
  }

  // Student
  const csvStudents = dataObjects[1].values();
  for (const csvStudent of csvStudents) {
    const existingStudent: Student = await Student.findOne({
      where: {
        email: {
          [Op.eq]: csvStudent.email,
        },
      },
    });

    // For Troubleshooting only
    // LOG.info('existingStudent:' + JSON.stringify(existingStudent));
    // LOG.info('csvStudent:' + JSON.stringify(csvStudent));

    if (existingStudent) {
      LOG.info(`Student found in DB: ${existingStudent.email}`);
      idMappingTable.Student.set(existingStudent.email, existingStudent.id);
      if (existingStudent.name !== csvStudent.name) {
        LOG.info(
          `Student found in DB: ${existingStudent.email} has a new name to update: ${existingStudent.name} to ${csvStudent.name}`
        );
        existingStudent.name = csvStudent.name;
        await existingStudent.save();
      }
    } else {
      LOG.info(`Student NOT found in DB: ${csvStudent.email}. Adding...`);
      const newStudent = Student.build({
        email: csvStudent.email,
        name: csvStudent.name,
      });
      await newStudent.save();
      idMappingTable.Student.set(newStudent.email, newStudent.id);
    }
  }

  // Class
  const csvClasses = dataObjects[2].values();
  for (const csvClass of csvClasses) {
    const existingClass: Class = await Class.findOne({
      where: {
        code: {
          [Op.eq]: csvClass.code,
        },
      },
    });

    // For Troubleshooting only
    // LOG.info('existingClass:' + JSON.stringify(existingClass));
    // LOG.info('csvClass:' + JSON.stringify(csvClass));

    if (existingClass) {
      LOG.info(`Class found in DB: ${existingClass.code}`);
      idMappingTable.Class.set(existingClass.code, existingClass.id);
      if (existingClass.name !== csvClass.name) {
        LOG.info(
          `Class found in DB: ${existingClass.code} has a new name to update: ${existingClass.name} to ${csvClass.name}`
        );
        existingClass.name = csvClass.name;
        await existingClass.save();
      }
    } else {
      LOG.info(`Class NOT found in DB: ${csvClass.code}. Adding...`);
      const newClass = Class.build({
        code: csvClass.code,
        name: csvClass.name,
      });
      await newClass.save();
      idMappingTable.Class.set(newClass.code, newClass.id);
    }
  }

  // Subject
  const csvSubjects = dataObjects[3].values();
  for (const csvSubject of csvSubjects) {
    const existingSubject: Subject = await Subject.findOne({
      where: {
        code: {
          [Op.eq]: csvSubject.code,
        },
      },
    });

    // For Troubleshooting only
    // LOG.info('existingSubject:' + JSON.stringify(existingSubject));
    // LOG.info('csvSubject:' + JSON.stringify(csvSubject));

    if (existingSubject) {
      LOG.info(`Subject found in DB: ${existingSubject.code}`);
      idMappingTable.Subject.set(existingSubject.code, existingSubject.id);
      if (existingSubject.name !== csvSubject.name) {
        LOG.info(
          `Subject found in DB: ${existingSubject.code} has a new name to update: ${existingSubject.name} to ${csvSubject.name}`
        );
        existingSubject.name = csvSubject.name;
        await existingSubject.save();
      }
    } else {
      LOG.info(`Subject NOT found in DB: ${csvSubject.code}. Adding...`);
      const newSubject = Subject.build({
        code: csvSubject.code,
        name: csvSubject.name,
      });
      await newSubject.save();
      idMappingTable.Subject.set(newSubject.code, newSubject.id);
    }
  }

  // TeacherStudentClassSubjectMapping
  const csvMappings = dataObjects[4].values();
  for (const csvMapping of csvMappings) {
    const existingMapping: TeacherStudentClassSubjectMapping =
      await TeacherStudentClassSubjectMapping.findOne({
        where: {
          teacherId: {
            [Op.eq]: idMappingTable.Teacher.get(csvMapping.teacherEmail),
          },
          studentId: {
            [Op.eq]: idMappingTable.Student.get(csvMapping.studentEmail),
          },
          classId: {
            [Op.eq]: idMappingTable.Class.get(csvMapping.classCode),
          },
          subjectId: {
            [Op.eq]: idMappingTable.Subject.get(csvMapping.subjectCode),
          },
        },
      });

    // For Troubleshooting only
    // LOG.info('existingMapping:' + JSON.stringify(existingMapping));
    // LOG.info('csvMapping:' + JSON.stringify(csvMapping));

    if (existingMapping) {
      LOG.info(
        `Mapping found in DB: teacherId: ${existingMapping.teacherId} | studentId: ${existingMapping.studentId} | classId: ${existingMapping.classId} | subjectId: ${existingMapping.subjectId}`
      );
      if (
        (existingMapping.active && csvMapping.toDelete) ||
        (!existingMapping.active && !csvMapping.toDelete)
      ) {
        LOG.info(
          `Mapping found in DB: ${existingMapping.teacherId} | studentId: ${existingMapping.studentId} | classId: ${existingMapping.classId} | subjectId: ${existingMapping.subjectId} to be deleted (soft-delete): active ${existingMapping.active} and toDelete ${csvMapping.toDelete}`
        );
        existingMapping.active = !csvMapping.toDelete;
        await existingMapping.save();
      }
    } else {
      LOG.info(
        `Mapping NOT found in DB: teacherId: ${csvMapping.teacherEmail} | studentId: ${csvMapping.studentEmail} | classId: ${csvMapping.classCode} | subjectId: ${csvMapping.subjectCode}. Adding...`
      );
      const newMapping = TeacherStudentClassSubjectMapping.build({
        teacherId: idMappingTable.Teacher.get(csvMapping.teacherEmail),
        studentId: idMappingTable.Student.get(csvMapping.studentEmail),
        classId: idMappingTable.Class.get(csvMapping.classCode),
        subjectId: idMappingTable.Subject.get(csvMapping.subjectCode),
        active: !csvMapping.toDelete,
      });
      await newMapping.save();
    }
  }
};

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
    externalClassStudentMapping = await axios.get(
      `http://localhost:5000/students?class=${reqClassCode}&offset=0&limit=${MAX_STUDENTS_PER_CLASS}`
    );
    externalClassStudentMappingData = externalClassStudentMapping.data;

    // Handling Edge Scenario
    if (externalClassStudentMappingData.count > MAX_STUDENTS_PER_CLASS) {
      LOG.info(
        `External Students more than MAX_STUDENTS_PER_CLASS: ${MAX_STUDENTS_PER_CLASS}, fetch again with new limit.`
      );
      externalClassStudentMapping = await axios.get(
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

export const retrieveWorkloadReport =
  async (): Promise<StudentListingResponse> => {
    // Retrieve number of class count group by distinct teacher and subject
    const workloadReportData = await TeacherStudentClassSubjectMapping.findAll({
      attributes: [
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('classId'))
          ),
          'numberOfClasses',
        ],
      ],
      where: {
        active: {
          [Op.eq]: true,
        },
      },
      include: [
        {
          model: Teacher,
          attributes: ['name'],
        },
        {
          model: Subject,
          attributes: ['code', 'name'],
        },
      ],
      group: ['teacherId', 'subjectId'],
    });

    // For Troubleshooting only
    // LOG.info(JSON.stringify(workloadReportData));

    const workloadReportResponse: WorkloadReportResponse = {};
    for (const workloadReportItem of workloadReportData) {
      if (!workloadReportResponse[workloadReportItem.Teacher.name]) {
        workloadReportResponse[workloadReportItem.Teacher.name] = [];
      }
      workloadReportResponse[workloadReportItem.Teacher.name].push({
        subjectCode: workloadReportItem.Subject.code,
        subjectName: workloadReportItem.Subject.name,
        numberOfClasses: workloadReportItem.get('numberOfClasses'),
      });

      // For Troubleshooting only
      // LOG.info(JSON.stringify(workloadReportItem));
    }

    return workloadReportResponse;
  };
