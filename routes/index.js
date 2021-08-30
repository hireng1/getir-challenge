import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import ChallengeQueryDTO from '../dto/challenge_query_dto.js';
import ChallengeService from '../services/challenge_service.js';
import ChallengeMongoDAO from '../dao/challenge_mongo_dao.js';
import ChallengeErrorDTO from '../dto/challenge_error_dto.js';
import ChallengeResultDTO from '../dto/challenge_result_dto.js';

const router = Router();

/**
 * Mandatory validations for input fields
 */
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
  res.status(405).json(new ChallengeErrorDTO(1003, 'This HTTP method is currently not supported. Kindly refer to the API Documentation'));
});

router.post('/', validations(),  (req, res) => {
    const errorFormatter = ({ msg, param }) => `Error with field ${param}: ${msg}`;
    // Carry out validations and respond to request in case of errors
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ChallengeErrorDTO(1002, `ERROR:: Bad request, Validation errors detected [DEBUG Info :${errors.array()}]`));
    }
    // Unpacking the request object
    const {
      startDate, endDate, minCount, maxCount,
    } = req.body;

    // TODO: Make singleton by adding static method
    // Instantiating the Service object with an instance of 
    // ChallengeMongoDAO which is has been extended from the  
    // ChallengeInterface class
    const service = new ChallengeService(new ChallengeMongoDAO());
    return service.getData(new ChallengeQueryDTO(startDate, endDate, maxCount, minCount))
      .then((records) => {
        if (records.length === 0) {
          // Empty record set throws a 404
          res.status(404).json(new ChallengeErrorDTO(1001, 'ERROR:: Query returned an empty Result Set'));
        } else {
          // Yay, we found some results
          res.status(200).json(new ChallengeResultDTO(0, 'Success', records));
        }
      })
      // Possible error while executing query are responded with the error 
      // message, any & all upstream errors from Service & DAO are flown in here
      .catch((err) => res.status(500).json(new ChallengeErrorDTO(1000,
         `ERROR:: Error while pulling up records [DEBUG Info :${err.message}]`)));
  });

export default router;
