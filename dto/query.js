export default class QueryDto {
  constructor(startDate, endDate, maxCount, minCount) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxCount = maxCount;
    this.minCount = minCount;
  }
}
