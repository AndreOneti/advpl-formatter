'use strict';
import * as vscode from 'vscode';
import { whiteSpaceRemove } from './stringFormatter';

const RegexBegin = /^\s{0,}Class|^\s{0,}Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql/i;
const RegexMiddle = /^\s{0,}ELSEIF|^\s{0,}ELSE/i;
const RegexEnd = /^\s{0,}EndClass|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql/i;
const RegexReturn = /^\s{0,}Return/i;
const { activeTextEditor } = vscode.window;
const editor = Number(activeTextEditor.options.tabSize);

var currentTabZize: number = 0;
var isBlock: number = 0;

export function Regex(line: string): string {

  if (currentTabZize < 0) currentTabZize = 0;

  if (RegexBegin.test(line)) {
    let newLine = whiteSpaceRemove(line, currentTabZize);
    currentTabZize += editor;
    isBlock += 1;
    return newLine;
  }

  if (RegexMiddle.test(line)) {
    currentTabZize -= editor;
    let newLine = whiteSpaceRemove(line, currentTabZize);
    currentTabZize += editor;
    return newLine;
  }

  if (RegexEnd.test(line)) {
    currentTabZize -= editor;
    isBlock -= 1;
    let newLine = whiteSpaceRemove(line, currentTabZize);
    return newLine;
  }

  if (RegexReturn.test(line)) {
    if (isBlock <= 1) {
      currentTabZize -= editor;
      isBlock -= 1;
      let newLine = whiteSpaceRemove(line, currentTabZize);
      return newLine;
    }

    if (isBlock > 1) {
      let newLine = whiteSpaceRemove(line, currentTabZize);
      return newLine;
    }
  }

  let newLine = whiteSpaceRemove(line, currentTabZize);
  return newLine;
}