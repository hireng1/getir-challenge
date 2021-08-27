import { expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import MongoHelper from '../dao/helper.js';
import ErrorDTO from '../dto/errorDTO.js';

beforeAll(async () => { await MongoHelper.connectMongoDB(); });

afterAll(async () => { await MongoHelper.disconnectDB(); });

describe('Index Controller tests', () => {
  it('Unit Test 1:: Check for HTTP GET is blocked', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(405);
    expect(res.body).toEqual(expect.objectContaining(
      new ErrorDTO(1003, 'This HTTP method is currently not supported. Kindly refer to the API Documentation')
      )
    );
  });

  it('Unit Test 2:: Test for Empty Result Set', async () => {
    const res = await request(app)
      .post('/')
      .send({
      startDate: '2029-12-10',
      endDate: '2029-12-13',
      minCount: 1,
      maxCount: 3});
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining(
        new ErrorDTO(1001, 'ERROR:: Query returned an empty Result Set')
        )
      );
  });

  it('Unit Test 3:: Test with Empty Parameters', async() => {
    const res = await request(app)
      .post('/')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining(
        new ErrorDTO(1002, 'ERROR:: Bad request, Validation errors detected [DEBUG Info :Error with field startDate: \
startDate must be in a YYYY-MM-DD format,Error with field endDate: endDate must be in a YYYY-MM-DD format,Error with \
field maxCount: maxCount must be a Valid Number,Error with field minCount: minCount must be a Valid Number]')
      )
    );
  });

  it('Unit Test 4:: Test with Incorrect Start Date', async() => {
    const res = await request(app)
      .post('/')
      .send({
      startDate: 'XYZ',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000});
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining(
        new ErrorDTO(1002, 'ERROR:: Bad request, Validation errors detected [DEBUG Info :Error with field startDate: startDate must be in a YYYY-MM-DD format]')
      )
    );
  });

  // Test with Incorrect End date, minCount, maxCount excluded to avoid recurring test cases

  it('Unit Test 5:: Test with All correct parameters for a 200', async() => {
    const res = await request(app)
      .post('/')
      .send({
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000});
    expect(res.status).toBe(200);
  });
});
