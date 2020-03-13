'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var libs_1 = require("./libs");
function activate(context) {
    vscode.languages.registerDocumentFormattingEditProvider('advpl', {
        provideDocumentFormattingEdits: function (document) {
            var activeTextEditor = vscode.window.activeTextEditor;
            if (activeTextEditor && activeTextEditor.document.languageId === 'advpl') {
                var currentTab = 0;
                var document_1 = activeTextEditor.document;
                var edit = new vscode.WorkspaceEdit();
                var editor = vscode.workspace.getConfiguration('editor');
                var file = document_1.getText().split('\n');
                var RegexBegin = /^\s{0,}Class|^\s{0,}Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;
                var RegexEnd = /^\s{0,}EndClass|^\s{0,}Return|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;
                for (var index = 0; index < file.length; index++) {
                    if (RegexEnd.test(file[index])) {
                        currentTab -= editor.tabSize;
                    }
                    if (currentTab < 0) {
                        currentTab = 0;
                    }
                    edit.replace(document_1.uri, new vscode.Range(index, 0, index, file[index].length), "" + libs_1.whiteSpaceRemove(file[index], currentTab));
                    if (RegexBegin.test(file[index])) {
                        currentTab += editor.tabSize;
                    }
                    if (index === file.length - 1) {
                        if (file[index] !== '') {
                            edit.insert(document_1.uri, document_1.lineAt(document_1.lineCount - 1).range.end, '\n');
                        }
                        var currentTab = 0;
                        vscode.workspace.applyEdit(edit);
                        return [];
                    }
                }
            }
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map