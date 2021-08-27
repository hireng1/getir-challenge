import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import QueryDto from '../dto/query.js';
import DataService from '../services/get-data.js';
import ResultMongoDao from '../dao/result-mongo-dao.js';
import ErrorDTO from '../dto/errorDTO.js';
import RecordDetail from '../dto/recordDetail.js';

const router = Router();

const validations = () => [
  body('startDate')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('startDate must be in a YYYY-MM-DD format'),    
  body('endDate')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('endDate must be in a YYYY-MM-DD format'),
  // Commented out below code although can be added based on business requirements
  // body('startDate').custom((value, { req }) => value < req.body.endDate).withMessage('startDate should be less than endDate'),
  body('maxCount').isNumeric().withMessage('maxCount must be a Valid Number'),
  body('minCount').isNumeric().withMessage('minCount must be a Valid Number'),
  // Commented out below code although can be added based on business requirements
  // body('minCount').custom((value, { req }) => value < req.body.maxCount ).withMessage('minCount should be less than maxCount')
];

router.get('/', (req, res) => {
  res.status(405).json(new ErrorDTO(1003, 'This HTTP method is currently not supported. Kindly refer to the API Documentation'));
});

router.post('/', validations(),  (req, res) => {
    const errorFormatter = ({ msg, param }) => `Error with field ${param}: ${msg}`;
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ErrorDTO(1002, `ERROR:: Bad request, Validation errors detected [DEBUG Info :${errors.array()}]`));
    }
    const {
      startDate, endDate, minCount, maxCount,
    } = req.body;

    // TODO: Make singleton by adding static method
    const service = new DataService(new ResultMongoDao());
    return service.getData(new QueryDto(startDate, endDate, maxCount, minCount))
      .then((records) => {
        if (records.length === 0) {
          res.status(404).json(new ErrorDTO(1001, 'ERROR:: Query returned an empty Result Set'));
        } else {
          res.status(200).json(new RecordDetail(0, 'Success', records));
          // res.status(200).json({ code: '0', msg: 'Success', records });
        }
      })
      .catch((err) => res.status(500).json(new ErrorDTO(1000, `ERROR:: Error while pulling up records [DEBUG Info :${err.message}]`)));
  });

export default router;
