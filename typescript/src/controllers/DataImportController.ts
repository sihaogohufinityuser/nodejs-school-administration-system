import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from 'utils/index';
import {
  validateDataImport,
  populateDataObjectsFromJson,
  updateOrInsertDataObjects,
} from 'services/DataImportService';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');

const dataImportHandler: RequestHandler = async (req, res, next) => {
  const { file } = req;

  try {
    if (file) {
      const data = await convertCsvToJson(file.path);

      // For Troubleshooting only
      // LOG.info(JSON.stringify(data, null, 2));

      // Perform Validation on CSV data
      validateDataImport(data);

      // Build maps of Teachers / Students / Classes / Subjects, and array of TeacherStudentClassSubjectMappings before update/insertion into DB
      const dataObjects = populateDataObjectsFromJson(data);

      // Update/Insertion of Teachers / Students / Classes / Subjects / TSCSMapping into DB
      await updateOrInsertDataObjects(dataObjects);

      return res.sendStatus(StatusCodes.NO_CONTENT);
    } else {
      LOG.error('There is no file in the request.');
      throw new Error('BAD_REQUEST');
    }
  } catch (error) {
    LOG.error(error.message);
    if (error.message === 'BAD_REQUEST')
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'File validation has failed. Please check your file.',
      });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
