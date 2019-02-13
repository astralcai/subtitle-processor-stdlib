import {constructRawNameDict, loadSubtitles} from "subtitle-processor";

/**
 * This function takes the string of an entire subtitle file and formats it
 *
 * @param {string} subtitleString
 * @param {string} nameDictString the dictionary string
 * @param {boolean} renumber specifies if the user wish to reassign indices
 * @returns {string} the formatted subtitle string
 */
module.exports = async (subtitleString, nameDictString = "", renumber = false, context): Promise<string> => {
  let subtitles = loadSubtitles(subtitleString).reformat();
  if (nameDictString) {
    subtitles = subtitles.translateNames(constructRawNameDict(nameDictString));
  }
  if (renumber) {
    subtitles = subtitles.renumber();
  }
  return subtitles.toString();
};
