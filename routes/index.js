import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import QueryDto from '../dto/query.js';
import DataService from '../services/get-data.js';
import ResultMongoDao from '../dao/result-mongo-dao.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(405).json({ code: '405', msg: 'This HTTP method is currently not supported. Kindly refer to the API Documentation' });
});

router.post('/', body('startDate')
  .isDate({ format: 'YYYY-MM-DD' })
  .withMessage('startDate must be in a YYYY-MM-DD format'),
body('endDate')
  .isDate({ format: 'YYYY-MM-DD' })
  .withMessage('endDate must be in a YYYY-MM-DD format'),
body('maxCount').isNumeric().withMessage('maxCount must be a Valid Number'),
body('minCount').isNumeric().withMessage('maxCount must be a Valid Number'),
(req, res) => {
  const errorFormatter = ({ msg, param }) => `Error with field ${param}: ${msg}`;
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      msg: 'Bad Request, validation errors detected',
      errors: errors.array(),
    });
  }
  const {
    startDate, endDate, minCount, maxCount,
  } = req.body;
  const service = new DataService(new ResultMongoDao());
  return service.getData(new QueryDto(startDate, endDate, maxCount, minCount))
    .then((records) => {
      if (records.length === 0) {
        res.status(404).json({ code: '1001', msg: 'Empty result set', records: '' });
      } else {
        res.status(200).json({ code: '0', msg: 'Success', records });
      }
    })
    .catch((err) => res.status(500).json({ code: '1000', msg: 'Error while pulling up records', error: err.message }));
});

export default router;
