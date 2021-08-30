/**
 * This DTO object represents the actual response which would be
 * sent back by the controller
 * 
 * @param code {integer} - 0 for success, other numeric value for errors
 * @param msg {string} - a human readable message in case there are any errors, 
 *                       on successful query completion should return "success"
 * @param records {ChallengeRecordDTO[]} - an array of ChallengeRecordDTO 
 */
export default class ChallengeResultDTO {
    constructor(code, msg, records) {
        this.code = code;
        this.msg = msg;
        this.records = records;
    }
}