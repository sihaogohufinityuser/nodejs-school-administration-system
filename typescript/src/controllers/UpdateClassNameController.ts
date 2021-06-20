import Express, { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { validateUpdateClassNameRequest, updateClassNameByClassCode } from 'services/UpdateClassNameService';
import Logger from '../config/logger';

const UpdateClassNameController = Express.Router();
const LOG = new Logger('UpdateClassNameController.js');

const updateClassNameHandler: RequestHandler = async (req, res, next) => {
  try {
    const reqClassCode = req.params.classCode;
    const reqClassName = req.body.className;

    // Perform Validation on req
    validateUpdateClassNameRequest(reqClassCode, reqClassName);

    // Process
    await updateClassNameByClassCode(reqClassCode, reqClassName);

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    LOG.error(error.message);
    if (error.message === 'BAD_REQUEST')
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Bad Request. Please check your request body.',
      });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
};

UpdateClassNameController.put('/class/:classCode', updateClassNameHandler);

export default UpdateClassNameController;
