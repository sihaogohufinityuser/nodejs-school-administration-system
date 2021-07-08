import Express from 'express';
import DataImportController from './controllers/DataImportController';
import TeacherListingController from './controllers/TeacherListingController';
import StudentListingController from './controllers/StudentListingController';
import UpdateClassNameController from './controllers/UpdateClassNameController';
import WorkloadReportController from './controllers/WorkloadReportController';
import HealthcheckController from './controllers/HealthcheckController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', TeacherListingController);
router.use('/', StudentListingController);
router.use('/', UpdateClassNameController);
router.use('/', WorkloadReportController);
router.use('/', HealthcheckController);

export default router;
