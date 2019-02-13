import {loadCc} from "subtitle-processor";

/**
 * This function takes the string of an entire cc file and formats it
 *
 * @param {string} ccString
 * @returns {string} the formatted cc string
 */
module.exports = async (ccString: string, context): Promise<string> => {
  return loadCc(ccString).cleanUpCcLines().reformat().toString();
};
