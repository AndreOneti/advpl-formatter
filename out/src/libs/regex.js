'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var stringFormatter_1 = require("./stringFormatter");
var RegexBegin = /^\s{0,}Class|^\s{0,}Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql/i;
var RegexMiddle = /^\s{0,}ELSEIF|^\s{0,}ELSE/i;
var RegexEnd = /^\s{0,}EndClass|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql/i;
var RegexReturn = /^\s{0,}Return/i;
var activeTextEditor = vscode.window.activeTextEditor;
var editor = Number(activeTextEditor.options.tabSize);
var currentTabZize = 0;
var isBlock = 0;
function Regex(line) {
    if (currentTabZize < 0)
        currentTabZize = 0;
    if (RegexBegin.test(line)) {
        var newLine_1 = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
        currentTabZize += editor;
        isBlock += 1;
        return newLine_1;
    }
    if (RegexMiddle.test(line)) {
        currentTabZize -= editor;
        var newLine_2 = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
        currentTabZize += editor;
        return newLine_2;
    }
    if (RegexEnd.test(line)) {
        currentTabZize -= editor;
        isBlock -= 1;
        var newLine_3 = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
        return newLine_3;
    }
    if (RegexReturn.test(line)) {
        if (isBlock <= 1) {
            currentTabZize -= editor;
            isBlock -= 1;
            var newLine_4 = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
            return newLine_4;
        }
        if (isBlock > 1) {
            var newLine_5 = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
            return newLine_5;
        }
    }
    var newLine = stringFormatter_1.whiteSpaceRemove(line, currentTabZize);
    return newLine;
}
exports.Regex = Regex;
//# sourceMappingURL=regex.js.map