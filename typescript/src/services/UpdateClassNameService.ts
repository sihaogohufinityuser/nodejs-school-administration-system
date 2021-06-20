import Logger from '../config/logger';
import { Op } from 'sequelize';
import Class from 'models/Class';

const LOG = new Logger('util.js');

export const validateUpdateClassNameRequest = (
  reqClassCode: string,
  reqClassName: string
): void => {
  // For Troubleshooting only
  // LOG.info(`reqClassCode: ${reqClassCode}, reqClassName: ${reqClassName}`);

  // Validating all parameters to be mandatory
  if (!reqClassCode || !reqClassName) {
    LOG.error(
      'Validation failed for UpdateClassName API Query Parameters. There are parameters with empty value.'
    );
    throw new Error('BAD_REQUEST');
  }

  return;
};

export const updateClassNameByClassCode = async (
  reqClassCode: string,
  reqClassName: string
): Promise<void> => {
  // For Troubleshooting only
  // LOG.info(`reqClassCode: ${reqClassCode}, reqClassName: ${reqClassName}`);

  // Find the Class by code, for update of name
  const classToUpdate = await Class.findOne({
    where: {
      code: {
        [Op.eq]: reqClassCode,
      },
    },
  });

  // For Troubleshooting only
  // LOG.info(JSON.stringify(classToUpdate));

  if (classToUpdate) {
    LOG.info(`Class found in DB: ${classToUpdate.code}`);
    if (classToUpdate.name !== reqClassName) {
      LOG.info(
        `Class found in DB: ${classToUpdate.code} has a new name to update: ${classToUpdate.name} to ${reqClassName}`
      );
      classToUpdate.name = reqClassName;
      await classToUpdate.save();
    }
  } else {
    LOG.error(`Class ${reqClassCode} cannot be found.`);
    throw new Error('BAD_REQUEST');
  }
};
