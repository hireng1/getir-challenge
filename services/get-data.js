export default class DataService {
  constructor(dao) {
    this.dao = dao;
  }

  async getData(queryDto) {
    // throw new Error('Error from Service object');
    return this.dao.getResults(queryDto);
  }
}
