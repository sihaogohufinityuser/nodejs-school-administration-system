import Logger from '../config/logger';
import Subject from 'models/Subject';
import Teacher from 'models/Teacher';
import TeacherStudentClassSubjectMapping from 'models/TeacherStudentClassSubjectMapping';
import { Op, Sequelize } from 'sequelize';
import { StudentListingResponse } from 'types/StudentListingResponse';
import { WorkloadReportResponse } from 'types/WorkloadReportResponse';

const LOG = new Logger('WorkloadReportService.js');

export const retrieveWorkloadReport =
  async (): Promise<StudentListingResponse> => {
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

    LOG.info(
      'Restructuring database result to the correct API response structure'
    );
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
