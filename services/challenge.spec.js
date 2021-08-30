import { expect, it, jest } from '@jest/globals';
import request from 'supertest';
import MongoHelper from '../dao/mongo_helper';
import ChallengeService from './challenge_service';
import ChallengeMongoDAO from '../dao/challenge_mongo_dao';
import ChallengeQueryDTO from '../dto/challenge_query_dto';

// Mandatory DB connection before starting all tests
beforeAll(async () => { await MongoHelper.connectMongoDB(); });

// Disconnecting DB after all tests have been run successfully
afterAll(async () => { await MongoHelper.disconnectMongoDB(); });

// Unit test for Service
describe(' Unit Tests for Challenge Service', () => {

    const service = new ChallengeService(new ChallengeMongoDAO());

    it('Unit Test 1:: +ve test case with all correct parameters for a response object with more than 0 results', async() => {
        const res = await service.getData(new ChallengeQueryDTO('2016-01-26', '2018-02-02', 2804, 2802));
        expect(res.length).toBeGreaterThanOrEqual(1);
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
                key: expect.any(String),
                createdAt: expect.any(Date),
                totalCount: expect.any(Number),
            }),
        ]));
    });

    it('Unit Test 2:: Zero results', async() => {
        const res = await service.getData(new ChallengeQueryDTO('2016-01-26', '2018-02-02', 3, 1));
        expect(res.length === 0).toBeTruthy();
    });

});