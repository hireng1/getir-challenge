import { expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import MongoHelper from '../dao/mongo_helper';

// Mandatory DB connection before starting all tests
beforeAll(async () => { await MongoHelper.connectMongoDB(); });

// Disconnecting DB after all tests have been run successfully
afterAll(async () => { await MongoHelper.disconnectMongoDB(); });

// Integration tests
describe('Integration +ve test case', () => {
    it('Test with All correct parameters for a response object\
with more than 0 results in the required format', async() => {
        const res = await request(app)
          .post('/')
          .send({
          startDate: '2016-01-26',
          endDate: '2018-02-02',
          minCount: 2500,
          maxCount: 2800});
        expect(res.status).toBe(200);
        expect(res.body.records.length).toBeGreaterThanOrEqual(1);
        expect(res.body).toEqual(
            expect.objectContaining({
                code: 0,
                msg: 'Success',
                records: expect.arrayContaining([
                  expect.objectContaining({
                    key: expect.any(String),
                    createdAt: expect.any(String),
                    totalCount: expect.any(Number),
                  }),
                ]),
              }),
          );
      });
});