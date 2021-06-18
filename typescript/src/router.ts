import Express from 'express';
import DataImportController from './controllers/DataImportController';
import HealthcheckController from './controllers/HealthcheckController';
import StudentListingController from './controllers/StudentListingController';
import UpdateClassNameController from './controllers/UpdateClassNameController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', StudentListingController);
router.use('/', UpdateClassNameController)
router.use('/', HealthcheckController);

export default router;
