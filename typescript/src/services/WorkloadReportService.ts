import Logger from '../config/logger';
import Subject from 'models/Subject';
import Teacher from 'models/Teacher';
import TeacherStudentClassSubjectMapping from 'models/TeacherStudentClassSubjectMapping';
import { Op, Sequelize } from 'sequelize';
import { WorkloadReportResponse } from 'types/WorkloadReportResponse';

const LOG = new Logger('WorkloadReportService.js');

export const retrieveWorkloadReportData = async () => {
  // Retrieve number of class count, distinct classId, and group by teacherId, subjectId
  LOG.info(
    'Retrieve number of class count, distinct classId, and group by teacherId, subjectId'
  );
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

  return workloadReportData;
};

export const restructureWorkloadReport = (
  workloadReportData: any
): WorkloadReportResponse => {
  LOG.info(
    'Restructuring database result to the correct API response structure'
  );
  const workloadReportResponse: WorkloadReportResponse = {};
  for (const workloadReportItem of workloadReportData) {
    // For Troubleshooting only
    // LOG.info(JSON.stringify(workloadReportItem));

    if (!workloadReportResponse[workloadReportItem.Teacher.name]) {
      workloadReportResponse[workloadReportItem.Teacher.name] = [];
    }
    workloadReportResponse[workloadReportItem.Teacher.name].push({
      subjectCode: workloadReportItem.Subject.code,
      subjectName: workloadReportItem.Subject.name,
      numberOfClasses: workloadReportItem.get('numberOfClasses'),
    });
  }

  return workloadReportResponse;
};
