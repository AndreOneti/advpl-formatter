'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  vscode.languages.registerDocumentFormattingEditProvider('advpl', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const { activeTextEditor } = vscode.window;

      if (activeTextEditor && activeTextEditor.document.languageId === 'advpl') {
        var currentTab = 0;
        const { document } = activeTextEditor;
        const edit = new vscode.WorkspaceEdit();
        const editor = vscode.workspace.getConfiguration('editor');

        const file = document.getText().split('\n');
        const RegexBegin = /^\s{0,}Class|^\s{0,}Method|^\s{0,}For|^\s{0,}if|^\s{0,}While|^\s{0,}BeginSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;
        const RegexEnd = /^\s{0,}EndClass|^\s{0,}Return|^\s{0,}Next|^\s{0,}EndIf|^\s{0,}EndDo|^\s{0,}EndSql|^\s{0,}ELSEIF|^\s{0,}ELSE/i;

        for (let index = 0; index < file.length; index++) {
          if (RegexEnd.test(file[index])) {
            currentTab -= editor.tabSize;
          }
          if (currentTab < 0) {
            currentTab = 0;
          }
          if (file[index].toString().trim() !== '') {
            edit.replace(document.uri, new vscode.Range(index, 0, index, file[index].length),
              `${' '.repeat(currentTab)}${formattetSring(file[index].toString().trim())}`);
          }
          if (file[index].toString().trim() === '') {
            edit.replace(document.uri, new vscode.Range(index, 0, index, file[index].length), `${file[index].toString().trim()}`);
          }
          if (RegexBegin.test(file[index])) {
            currentTab += editor.tabSize;
          }
          if (index === file.length - 1) {
            if (file[index] !== '') {
              edit.insert(document.uri, document.lineAt(document.lineCount - 1).range.end, '\n');
            }
            var currentTab = 0;
            vscode.workspace.applyEdit(edit)
            return [];
          }
        }
      }
    }
  });
}

function formattetSring(str) {
  return str.replace(/([^"]+)|("[^"]+")/g, function ($0, $1, $2) {
    if ($1) {
      return $1.replace(/\s{1,}/g, " ");
    } else {
      return $2;
    }
  });
}
