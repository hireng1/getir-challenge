import { expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import MongoHelper from '../dao/helper.js';
  
beforeAll(async () => { await MongoHelper.connectMongoDB(); });

afterAll(async () => { await MongoHelper.disconnectDB(); });

describe('Integration tests', () => {
    it('Test with All correct parameters for a response object', async() => {
        const res = await request(app)
          .post('/')
          .send({
          startDate: '2016-01-26',
          endDate: '2018-02-02',
          minCount: 2700,
          maxCount: 3000});
        expect(res.status).toBe(200);
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