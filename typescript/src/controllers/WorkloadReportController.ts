import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Logger from '../config/logger';
import { retrieveWorkloadReportData, restructureWorkloadReport } from 'services/WorkloadReportService';

const WorkloadReportController = Express.Router();
const LOG = new Logger('WorkloadReportController.js');

const workloadReportHandler: RequestHandler = async (req, res, next) => {
  try {
    // Retrieve workload report data from database
    const workloadReportData = await retrieveWorkloadReportData();

    // Restructure database result to the correct API response structure
    const response = restructureWorkloadReport(workloadReportData);

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    LOG.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

WorkloadReportController.get(
  '/reports/workload',
  workloadReportHandler
);

export default WorkloadReportController;
