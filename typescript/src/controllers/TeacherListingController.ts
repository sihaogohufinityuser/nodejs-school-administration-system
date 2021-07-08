import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Logger from '../config/logger';
import { retrieveTeacherListingData } from 'services/TeacherListingService';

const TeacherListingController = Express.Router();
const LOG = new Logger('TeacherListingController.js');

const teacherListingHandler: RequestHandler = async (req, res, next) => {
  try {
    // Retrieve workload report data from database
    const teacherListingData = await retrieveTeacherListingData();

    // Restructure database result to the correct API response structure
    const response = teacherListingData;

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    LOG.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

TeacherListingController.get(
  '/teachers',
  teacherListingHandler
);

export default TeacherListingController;
