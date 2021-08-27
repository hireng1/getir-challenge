import ResultInterface from './result-interface.js';
import RecordDto from '../dto/record.js';
import MongoHelper from './helper.js';

export default class ResultMongoDao extends ResultInterface {
  static queryAndMap(client, dbName, collection, pipeline) {
    return new Promise((resolve, reject) => {
      const aggCursor = client.db(dbName).collection(collection).aggregate(pipeline);
      const recordDTOArray = [];
      aggCursor.forEach((recordDTO) => recordDTOArray.push(new RecordDto(recordDTO.key,
        recordDTO.createdAt, recordDTO.totalCount)),
      (err) => {
        if (err) { return reject(err); }
        return resolve(recordDTOArray);
      });
    });
  }

  getResults(query) {
    this.query = query;
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gt: new Date(query.startDate),
            $lt: new Date(query.endDate),
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
    return ResultMongoDao.queryAndMap(MongoHelper.mongoClient, 'getir-case-study', 'records', pipeline);
    // console.log('Query complete..');
    // console.log(records);
    // return records;
  }
}
