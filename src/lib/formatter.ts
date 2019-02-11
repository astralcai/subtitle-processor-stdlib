/**
 * @fileOverview This file contains functions that formats subtitle strings
 */

"use strict";

export const EOL = "\r\n"; // using Windows style EOL

export function splitSubtitleStringIntoGroups(subString: string): string[] {

  // each group is a subtitle line
  const groups: string[] = [];

  // replace all EOL with "\n" for easy processing
  subString = subString.replace(/\r\n?/g, "\n");

  // split subtitle string into lines
  const rawList: string[] = subString.split(/\n *([0-9]+ *\n)/g); // separate groups by index string

  let buffer: string = rawList.shift(); // the first item is already a complete line group
  rawList.forEach((token) => {
    if (/^[0-9]+\s*\n$/.test(token)) {
      // store existing content of buffer and start new buffer for new subtitle group
      groups.push(buffer.replace(/\s*$/, "")); // remove trailing whitespace characters
      buffer = token.replace(/ /g, ""); // remove trailing spaces
    } else {
      // append content to buffer, removing trailing spaces for all internal lines
      buffer = buffer + token.replace(/ *\n/g, "\n");
    }
  });

  return groups;
}
