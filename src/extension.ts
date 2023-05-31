/* eslint-disable operator-linebreak */
/* eslint-disable no-plusplus */
/* eslint-disable-next-line import/no-unresolved */
import * as vscode from 'vscode';
import RuntimeController from './controller/RuntimeController';
import { isPythonFile, debounce } from './util/util';
import ServerStatusController from './controller/ServerStatusController';
import GreetFileController from './controller/GreetFileController';
import Extension from './model/Extension';
import ServerStatus from './model/ServerStatus';

const globalDiagnostics: {
  [filePath: string]: readonly vscode.Diagnostic[] | undefined;
} = {};

const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100,
);

const extension: Extension = Extension.getInstance(new ServerStatus());

export async function activate(context: vscode.ExtensionContext) {
  let stopProgressBar = false;
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  if (!RuntimeController.isInstalledRuntime()) {
    statusBarItem.text = '$(sync~spin) Installing greet';
    await Promise.all([
      RuntimeController.downloadRuntime()
        .then(async () => {
          if (!RuntimeController.isInstalledModel()) {
            await RuntimeController.downloadModel();
          }
          ServerStatusController.start();
          let flagStart = false;
          while (!flagStart) {
            if (
              // eslint-disable-next-line no-await-in-loop
              await ServerStatusController.isStart(extension.getServerStatus())
            ) {
              stopProgressBar = true;
              extension.getServerStatus()?.setStatus('start');
              extension.setServerStatus(extension.getServerStatus());
              statusBarItem.text = '$(check) greet';
              flagStart = true;
            }
          }
        })
        .catch(() => {
          // TO DO handling when the extension needs to be stopped
        }),
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Installing greet',
          cancellable: false,
        },
        async (progress) => {
          const totalSteps = 100;
          let currentStep = 0;
          while (currentStep < totalSteps && !stopProgressBar) {
            progress.report({ increment: 1 });
            // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 2300));
            currentStep++;
          }
          vscode.window.showInformationMessage('Installing greet ended');
        },
      ),
    ]);
  } else if (!RuntimeController.isInstalledModel()) {
    statusBarItem.text = '$(sync~spin) Installing greet';
    await Promise.all([
      RuntimeController.downloadModel()
        .then(async () => {
          ServerStatusController.start();
          let flagStart = false;
          while (!flagStart) {
            if (
              // eslint-disable-next-line no-await-in-loop
              await ServerStatusController.isStart(extension.getServerStatus())
            ) {
              stopProgressBar = true;
              extension.getServerStatus()?.setStatus('start');
              extension.setServerStatus(extension.getServerStatus());
              statusBarItem.text = '$(check) greet';
              flagStart = true;
            }
          }
        })
        .catch(() => {
          // TO DO handling when the extension needs to be stopped
        }),
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Installing greet',
          cancellable: false,
        },
        async (progress) => {
          const totalSteps = 100;
          let currentStep = 0;
          while (currentStep < totalSteps && !stopProgressBar) {
            progress.report({ increment: 1 });
            // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 2300));
            currentStep++;
          }
          vscode.window.showInformationMessage('Installing greet ended');
        },
      ),
    ]);
  } else {
    statusBarItem.text = '$(sync~spin) Starting greet';
    ServerStatusController.start();
  }

  let flagStart = false;
  while (!flagStart) {
    // eslint-disable-next-line no-await-in-loop
    if (await ServerStatusController.isStart(extension.getServerStatus())) {
      stopProgressBar = true;
      extension.getServerStatus()?.setStatus('start');
      extension.setServerStatus(extension.getServerStatus());
      statusBarItem.text = '$(check) greet';
      flagStart = true;
    }
  }

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

export function deactivate() {
  ServerStatusController.stop(extension.getServerStatus());
}
