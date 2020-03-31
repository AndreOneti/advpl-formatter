'use strict';
import * as vscode from 'vscode';
import { whiteSpaceRemove } from './stringFormatter';

const RegexBegin = /^\s{0,}Class|^\s{0,}Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql/i;
const RegexMiddle = /^\s{0,}ELSEIF|^\s{0,}ELSE/i;
const RegexEnd = /^\s{0,}EndClass|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql/i;
const RegexReturn = /^\s{0,}Return/i;
const { activeTextEditor } = vscode.window;
const editor = Number(activeTextEditor.options.tabSize);

const RegexSqlBegin = /^\s{0,}SELECT\s{0,}$|^\s{0,}ORDER\sBY\s{0,}$/i;
const RegexSqlMiddle = /^\s{0,}FROM\s{0,}|^\s{0,}WHERE|^\s{0,}ORDER\s{0,}BY/i;
const RegexSqlEnd = /^\s{0,}EndSql/i;
const RegexIsSql = /^\s{0,}BeginSql/i;

var currentTabSize: number = 0;
var identationSql: number = 0;
var isSql: boolean = false;
var isBlock: number = 0;

export function Regex(line: string): string {

  if (currentTabSize < 0) currentTabSize = 0;

  if (!isSql) {
    if (RegexBegin.test(line)) {
      let newLine = whiteSpaceRemove(line, currentTabSize);
      if (RegexIsSql.test(line)) {
        isSql = true;
        identationSql = currentTabSize;
      }
      currentTabSize += editor;
      isBlock += 1;
      return newLine;
    }

    if (RegexMiddle.test(line)) {
      currentTabSize -= editor;
      let newLine = whiteSpaceRemove(line, currentTabSize);
      currentTabSize += editor;
      return newLine;
    }

    if (RegexEnd.test(line)) {
      currentTabSize -= editor;
      isBlock -= 1;
      let newLine = whiteSpaceRemove(line, currentTabSize);
      return newLine;
    }
  }

  if (isSql) {
    if (RegexSqlBegin.test(line)) {
      let newLine = whiteSpaceRemove(line, currentTabSize);
      currentTabSize += editor;
      isBlock += 1;
      return newLine;
    }

    if (RegexSqlMiddle.test(line)) {
      currentTabSize -= editor;
      let newLine = whiteSpaceRemove(line, currentTabSize);
      currentTabSize += editor;
      return newLine;
    }

    if (RegexSqlEnd.test(line)) {
      currentTabSize = identationSql;
      isSql = false;
      isBlock -= 1;
      let newLine = whiteSpaceRemove(line, currentTabSize);
      return newLine;
    }
  }

  if (RegexReturn.test(line)) {
    if (isBlock <= 1) {
      currentTabSize -= editor;
      isBlock -= 1;
      let newLine = whiteSpaceRemove(line, currentTabSize);
      return newLine;
    }

    if (isBlock > 1) {
      let newLine = whiteSpaceRemove(line, currentTabSize);
      return newLine;
    }
  }

  let newLine = whiteSpaceRemove(line, currentTabSize);
  return newLine;
}