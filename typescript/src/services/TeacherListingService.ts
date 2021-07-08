import Logger from '../config/logger';
import Teacher from 'models/Teacher';

const LOG = new Logger('TeacherListingService.js');

export const retrieveTeacherListingData = async () => {
  // Retrieve Teachers
  LOG.info('Retrieve Teachers');
  const teacherListingData = await Teacher.findAll();

  // For Troubleshooting only
  //LOG.info(JSON.stringify(teacherListingData));

  return teacherListingData;
};
