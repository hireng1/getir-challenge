/**
 * This DTO reprents an error object with two fields
 * @param {integer} code - A numeric error code
 * @param {string} msg - A human readable message which explains more
 *                       about the error
 */
export default class ChallengeErrorDTO {
  constructor(code, msg) {
    this.code = code;
    this.msg = msg;
  }
}
