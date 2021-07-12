import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Logger from '../config/logger';
import { retrieveClassListingData } from 'services/ClassListingService';

const ClassListingController = Express.Router();
const LOG = new Logger('ClassListingController.js');

const classListingHandler: RequestHandler = async (req, res, next) => {
  try {
    // Retrieve workload report data from database
    const classListingData = await retrieveClassListingData();

    // Restructure database result to the correct API response structure
    const response = classListingData;

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    LOG.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

ClassListingController.get(
  '/classes',
  classListingHandler
);

export default ClassListingController;
