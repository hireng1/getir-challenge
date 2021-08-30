export default class ChallengeInterface {
  /**
  * This class represents an Interface, although JavaScript doesn't support
  * Interfaces and Abstract methods, the idea is to have a generic method
  * which can be implemented by a particular DAO object and make the 
  * service object immune to any changes on the DAO layer, the service accepts
  * a ChallengeQueryDTO and returns a ChallengeRecordDTO, any new DAO object
  * should implement these parameters, and the DAO object should be passed to 
  * the service
  * @param {ChallengeQueryDTO} query - the query object that comes in via 
  *                                    the HTTP request
  * @return {ChallengeRecordDTO[]} - the result of firing this query
  */
  getResults(query) {
    this.query = query;
  }
}
