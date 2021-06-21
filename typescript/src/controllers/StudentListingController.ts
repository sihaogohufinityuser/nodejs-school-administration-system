import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Logger from '../config/logger';
import { validateStudentListingRequest, retrieveStudentsByClassCode } from 'services/StudentListingService';

const StudentListingController = Express.Router();
const LOG = new Logger('StudentListingController.js');

const studentListingHandler: RequestHandler = async (req, res, next) => {
  try {
    const reqClassCode = req.params.classCode;
    const reqOffset = (req.query.offset as string) || '';
    const reqLimit = (req.query.limit as string) || '';

    // Perform Validation on req
    validateStudentListingRequest(reqClassCode, reqOffset, reqLimit);

    // Process
    const response = await retrieveStudentsByClassCode(
      reqClassCode,
      reqOffset,
      reqLimit
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    LOG.error(error.message);
    if (error.message === 'BAD_REQUEST')
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Bad Request. Please check your request URL.',
      });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

StudentListingController.get(
  '/class/:classCode/students',
  studentListingHandler
);

export default StudentListingController;
