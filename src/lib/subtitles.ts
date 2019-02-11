/**
 * @fileOverview This file contains definition for the data structure used to store subtitles
 */

"use strict";

import {EOL} from "./formatter";
import * as formatter from "./formatter";

interface ISubtitleLine {
  index: string;
  timestamp: string;
  eng: string;
  chs: string;
}

/**
 * The SubtitleList contains a list of SubtitleLines
 */
export class SubtitleList {

  /**
   * Constructs a SubtitleList with the complete string extracted from a subtitle file
   *
   * @param subtitleString {string}
   */
  public static async fromSubtitles(subtitleString: string): Promise<SubtitleList> {
    const groupList = formatter.splitSubtitleStringIntoGroups(subtitleString);
    const lineList: ISubtitleLine[] = groupList.map(constructCcLineWithStringGroup);
    return new SubtitleList(lineList);
  }

  /**
   * Constructs a SubtitleList with the complete string extracted from a raw cc file
   *
   * @param ccString {string}
   */
  public static async fromCc(ccString: string): Promise<SubtitleList> {
    const groupList = formatter.splitSubtitleStringIntoGroups(ccString);
    const lineList: ISubtitleLine[] = groupList.map(constructSubtitleLineWithStringGroup);
    return new SubtitleList(lineList);
  }

  protected lines: ISubtitleLine[];

  /**
   * Default constructor, not to be called directly
   *
   * @param lines {ISubtitleLine[]}
   */
  private constructor(lines: ISubtitleLine[]) {
    this.lines = lines;
  }

  /**
   * Concatenates all subtitle lines into a complete string to be printed
   *
   * @returns {Promise<string>} the complete subtitle string
   */
  public async toString(): Promise<string> {
    let result = "";
    this.lines.forEach((line) => {
      result += printSubtitleLine(line) + EOL;
    });
    return result;
  }
}

function printSubtitleLine(line: ISubtitleLine): string {
  const header = line.index + EOL + line.timestamp + EOL;
  const eng = line.eng ? line.eng + EOL : "";
  const chs = line.chs ? line.chs + EOL : "";
  return header + eng + chs;
}

function constructCcLineWithStringGroup(group: string): ISubtitleLine {
  const entry = group.split("\n");
  const [index, timestamp] = entry.slice(0, 2); // index and timestamp are fixed
  const eng = entry.slice(2).join(" "); // combine subtitle into one single line for raw cc
  return {index, timestamp, eng, chs: null};
}

function constructSubtitleLineWithStringGroup(group: string): ISubtitleLine {
  const entry = group.split("\n");
  const [index, timestamp] = entry.slice(0, 2); // index and timestamp are fixed
  let eng: string = null;
  let chs: string = null;
  if (entry.length === 3) {
    // assuming this group has only one Chinese line
    chs = entry[2];
  } else if (entry.length === 4) {
    // for a regular group with one English line and one Chinese line
    [eng, chs] = entry.slice(2, 4);
  } else if (entry.length > 4) {
    // throw error for groups larger than 4 lines long
    throw new Error("There are two many lines in group: \"" + group + "\"");
  }
  return {index, timestamp, eng, chs};
}
