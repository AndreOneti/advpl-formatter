'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
function activate(context) {
    vscode.commands.registerCommand('extension.advpl-formatter', function () {
        var activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor && activeTextEditor.document.languageId === 'advpl') {
            var currentTab = 0;
            var document = activeTextEditor.document;
            var edit = new vscode.WorkspaceEdit();
            var editor = vscode.workspace.getConfiguration('editor');
            var file = document.getText().split('\n');
            var RegexBegin = /^Class|^Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;
            var RegexEnd = /^EndClass|^Return|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;
            for (var index = 0; index < file.length; index++) {
                if (RegexEnd.test(file[index])) {
                    currentTab -= editor.tabSize;
                }
                if (currentTab < 0) {
                    currentTab = 0;
                }
                edit.replace(document.uri, new vscode.Range(index, 0, index, file[index].length), "" + ' '.repeat(currentTab) + file[index].toString().trim());
                if (RegexBegin.test(file[index])) {
                    currentTab += editor.tabSize;
                }
                if (index === file.length - 1) {
                    if (file[index] !== '') {
                        edit.insert(document.uri, document.lineAt(document.lineCount - 1).range.end, '\n');
                    }
                    var currentTab = 0;
                    return vscode.workspace.applyEdit(edit);
                }
            }
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map