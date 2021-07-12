import Logger from '../config/logger';
import Class from 'models/Class';

const LOG = new Logger('ClassListingService.js');

export const retrieveClassListingData = async () => {
  // Retrieve Classes
  LOG.info('Retrieve Classes');
  const classListingData = await Class.findAll();

  // For Troubleshooting only
  //LOG.info(JSON.stringify(classListingData));

  return classListingData;
};
