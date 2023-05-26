/* eslint-disable no-plusplus */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import RuntimeController from './controller/RuntimeController';
import { isPythonFile, debounce } from './util/util';
import ServerStatusController from './controller/ServerStatusController';
import GreetFileController from './controller/GreetFileController';
import Extension from './model/Extension';
import ServerStatus from './model/ServerStatus';
import FileManager from './manager/FileManager';

export async function activate(context: vscode.ExtensionContext) {
  if (!RuntimeController.isInstalled()) {
    await RuntimeController.download().catch(() => {
      // TO DO handling when the extension needs to be stopped
    });
  }

  ServerStatusController.start();
  const extension = Extension.getInstance(
    new ServerStatus(),
    new FileManager(),
    undefined,
  );

  // eslint-disable-next-line operator-linebreak
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('analysis');
  context.subscriptions.push(diagnosticCollection);

  const disposable = vscode.workspace.onDidChangeTextDocument(
    debounce((event: vscode.TextDocumentChangeEvent) => {
      if (isPythonFile(event.document)) {
        GreetFileController.analyzer(
          extension.getServerStatus(),
          diagnosticCollection,
          event.document,
        );
      }
    }, 1000),
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
