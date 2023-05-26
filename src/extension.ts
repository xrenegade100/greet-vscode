/* eslint-disable operator-linebreak */
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

const globalDiagnostics: {
  [filePath: string]: readonly vscode.Diagnostic[] | undefined;
} = {};

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
    debounce(async (event: vscode.TextDocumentChangeEvent) => {
      if (isPythonFile(event.document)) {
        globalDiagnostics[event.document.uri.fsPath] =
          await GreetFileController.analyzer(
            extension.getServerStatus(),
            diagnosticCollection,
            event.document,
          );
      }
    }, 1000),
  );
  context.subscriptions.push(disposable);

  const disposableOpen = vscode.workspace.onDidOpenTextDocument(
    async (document) => {
      if (isPythonFile(document)) {
        const diagnostics = globalDiagnostics[document.uri.fsPath];
        if (diagnostics) {
          diagnosticCollection.set(document.uri, diagnostics);
        } else {
          globalDiagnostics[document.uri.fsPath] =
            await GreetFileController.analyzer(
              extension.getServerStatus(),
              diagnosticCollection,
              document,
            );
        }
      }
    },
  );

  context.subscriptions.push(disposableOpen);
}

export function deactivate() {}
