import Logger from '../config/logger';
import Subject from 'models/Subject';
import Teacher from 'models/Teacher';
import TeacherStudentClassSubjectMapping from 'models/TeacherStudentClassSubjectMapping';
import { Op, Sequelize } from 'sequelize';
import { WorkloadReportResponse } from 'types/WorkloadReportResponse';

const LOG = new Logger('WorkloadReportService.js');

export const retrieveWorkloadReportDataRaw = async () => {
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
        attributes: ['id', 'name'],
      },
      {
        model: Subject,
        attributes: ['code', 'name'],
      },
    ],
    group: ['teacherId', 'subjectId'],
    raw: true,
  });

  // For Troubleshooting only
  LOG.info(JSON.stringify(workloadReportData));

  return workloadReportData;
};

export const sortAndRestructureWorkloadReport = (
  workloadReportData: any
): WorkloadReportResponse => {
  LOG.info(
    'Sorting and restructuring database result to the correct API response structure'
  );
  // Teacher name are not unique, therefore to avoid different Teachers with the same name as being grouped together. Teacher.id will also be appended as part of name.
  workloadReportData.sort((a: any, b: any) => {
    if (a['Teacher.name'] + ' [' + a['Teacher.id'] + ']' > b['Teacher.name'] + ' [' + b['Teacher.id'] + ']') return 1;
    else if (a['Teacher.name'] + ' [' + a['Teacher.id'] + ']' < b['Teacher.name'] + ' [' + b['Teacher.id'] + ']') return -1;
    else if (a['Subject.name'] > b['Subject.name']) return 1;
    else if (a['Subject.name'] < b['Subject.name']) return -1;
    else return 0;
  });

  const workloadReportResponse: WorkloadReportResponse = {};
  for (const workloadReportItem of workloadReportData) {
    // For Troubleshooting only
    // LOG.info(JSON.stringify(workloadReportItem));

    if (!workloadReportResponse[workloadReportItem['Teacher.name'] + ' [' + workloadReportItem['Teacher.id'] + ']']) {
      workloadReportResponse[workloadReportItem['Teacher.name'] + ' [' + workloadReportItem['Teacher.id'] + ']'] = [];
    }
    workloadReportResponse[workloadReportItem['Teacher.name'] + ' [' + workloadReportItem['Teacher.id'] + ']'].push({
      subjectCode: workloadReportItem['Subject.code'],
      subjectName: workloadReportItem['Subject.name'],
      numberOfClasses: workloadReportItem['numberOfClasses'],
    });
  }

  return workloadReportResponse;
};
