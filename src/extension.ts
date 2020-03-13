'use strict';
import * as vscode from 'vscode';
import { whiteSpaceRemove } from "./libs";

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
          edit.replace(document.uri, new vscode.Range(index, 0, index, file[index].length),
            `${whiteSpaceRemove(file[index], currentTab)}`);
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
