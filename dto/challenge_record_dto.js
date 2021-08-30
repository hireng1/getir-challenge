/**
 * This DTO object represents the actual result received by querying
 * the database. The DAO should return this object to the service 
 * upon successful query completion
 * 
 * @param key {string} - key field returned from the rcords
 * @param createdAt {string} - createdAt field from the records
 * @param totalCount {integer} - refers to the total of the count array
 *                             and between minCount and maxCount of original query
 */
export default class ChallengeRecordDTO {
  constructor(key, createdAt, totalCount) {
    this.key = key;
    this.createdAt = createdAt;
    this.totalCount = totalCount;
  }
}
