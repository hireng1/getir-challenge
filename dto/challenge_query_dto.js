/**
 * This DTO object represents the query object
 * The query object is initialised by the controller and passed onto the service
 * @param {string} startDate - The start date to pull up records
 * @param {string} endDate - The start date to pull up records
 * @param {integer} maxCount - maxCount to pull up records
 * @param {integer} minCount - maxCount to pull up records
 */
export default class ChallengeQueryDTO {
  constructor(startDate, endDate, maxCount, minCount) {
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.maxCount = maxCount;
    this.minCount = minCount;
  }
}
