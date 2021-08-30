import ChallengeInterface from './challenge_interface.js';
import ChallengeRecordDTO from '../dto/challenge_record_dto.js';
import MongoHelper from './mongo_helper.js';
import config from '../config.js';

export default class ChallengeMongoDAO extends ChallengeInterface {
  /**
   * Static helper method which takes in the below parameters
   * and returns a promise object with the actual query results upon 
   * successful query completion, otherwise an error
   * 
   * @param {MongoClient} client - MongoClient instance to use to interact 
   *                               with the database
   * @param {string} dbName - Name of the database to connect to
   * @param {string} collection - Name of the collection to pull records from
   * @param {[]} pipeline - MongoDB Aggregation pipeline 
   * @returns {Promise}
   */
  static queryAndMap(client, dbName, collection, pipeline) {
    return new Promise((resolve, reject) => {
      const aggCursor = client.db(dbName).collection(collection).aggregate(pipeline);
      const recordDTOArray = [];
      aggCursor.forEach((chlgRecordDTO) => 
        recordDTOArray.push(new ChallengeRecordDTO(chlgRecordDTO.key,
          chlgRecordDTO.createdAt, chlgRecordDTO.totalCount)),
      (err) => {
        if (err) { return reject(err); }
        return resolve(recordDTOArray);
      });
    });
  }

/**
  * MongoDB implementation of the ChallengeInterface API uses MongoJS drivers
  * @param {ChallengeQueryDTO} query - the query object that comes in via 
  *                                    the HTTP request
  * @return {ChallengeRecordDTO[]} - the result of firing this query
  */
  getResults(query) {
    this.query = query;
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gt: query.startDate,
            $lt: query.endDate,
          },
        },
      }, {
        $addFields: {
          totalCount: {
            $reduce: {
              input: '$counts',
              initialValue: 0,
              in: {
                $add: [
                  '$$value', '$$this',
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          totalCount: {
            $gt: query.minCount,
            $lt: query.maxCount,
          },
        },
      },
      {
        $project: {
          key: 1,
          createdAt: 1,
          totalCount: 1,
          _id: 0,
        },
      },
    ];

    // console.log('Firing query..');
    // throw new Error('Error from DAO Mongo');
    return ChallengeMongoDAO.queryAndMap(MongoHelper.mongoClient, config.db_name, 'records', pipeline);
  }
}
