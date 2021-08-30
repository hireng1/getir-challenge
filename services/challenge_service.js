/**
 * This class represents the actual service which is called by the controller
 * @param {ChallengeInterface} dao - the DAO object which the service uses to
 *                                   to fire queries and get results
 */
export default class ChallengeService {
  constructor(dao) {
    this.dao = dao;
  }

  /**
   * This API is called by the controller, although our problem does not 
   * dictate any business logic to be written, this would be the right place
   * to add any business logic before passing this quey to the DAO layer
   * 
   * @param {ChallengeQueryDTO} queryDto - the query DTO object
   * @returns {ChallengeResultDTO[]} the result of firing the above query object
   */
  async getData(queryDto) {

    // throw new Error('Error from Service object');
    return this.dao.getResults(queryDto);
  }
}
