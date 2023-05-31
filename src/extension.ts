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
  statusBarItem.command = 'serverStatus';
  let stopProgressBar = false;
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  if (!RuntimeController.isInstalledRuntime()) {
    statusBarItem.text = '$(sync~spin) Installing greet';
    await Promise.all([
      RuntimeController.downloadRuntime().then(async () => {
        if (!RuntimeController.isInstalledModel()) {
          await RuntimeController.downloadModel();
        }
        ServerStatusController.start(extension.getServerStatus());
        let flagStart = false;
        while (!flagStart) {
          if (
            // eslint-disable-next-line no-await-in-loop
            await ServerStatusController.isStart(extension.getServerStatus())
          ) {
            stopProgressBar = true;
            statusBarItem.text = '$(check) greet';
            flagStart = true;
          }
        }
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
      RuntimeController.downloadModel().then(async () => {
        ServerStatusController.start(extension.getServerStatus());
        let flagStart = false;
        while (!flagStart) {
          if (
            // eslint-disable-next-line no-await-in-loop
            await ServerStatusController.isStart(extension.getServerStatus())
          ) {
            stopProgressBar = true;
            statusBarItem.text = '$(check) greet';
            flagStart = true;
          }
        }
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
    ServerStatusController.start(extension.getServerStatus());
  }

  let flagStart = false;
  while (!flagStart) {
    // eslint-disable-next-line no-await-in-loop
    if (await ServerStatusController.isStart(extension.getServerStatus())) {
      stopProgressBar = true;
      statusBarItem.text = '$(check) greet';
      flagStart = true;
    }
  }

  const serverStatusCommand = vscode.commands.registerCommand(
    'serverStatus',
    async () => {
      if (extension.getServerStatus()?.getStatus() === 'start') {
        ServerStatusController.stop(extension.getServerStatus());
        // extension.getServerStatus()?.setStatus('stop');
        diagnosticCollection.clear();
        statusBarItem.text = '$(debug-continue) greet';
        statusBarItem.backgroundColor = new vscode.ThemeColor(
          'statusBarItem.errorBackground',
        );
      } else if (extension.getServerStatus()?.getStatus() === 'stop') {
        ServerStatusController.start(extension.getServerStatus());
        statusBarItem.text = '$(sync~spin) Starting greet';
        statusBarItem.backgroundColor = '';
        let flag = false;
        while (!flag) {
          if (
            // eslint-disable-next-line no-await-in-loop
            await ServerStatusController.isStart(extension.getServerStatus())
          ) {
            stopProgressBar = true;
            statusBarItem.text = '$(check) greet';
            statusBarItem.backgroundColor = '';
            flag = true;
          }
        }
      }
    },
  );
  context.subscriptions.push(serverStatusCommand);

  // eslint-disable-next-line operator-linebreak
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('analysis');
  context.subscriptions.push(diagnosticCollection);

  const disposable = vscode.workspace.onDidChangeTextDocument(
    debounce(async (event: vscode.TextDocumentChangeEvent) => {
      if (isPythonFile(event.document)) {
        if (await ServerStatusController.isStart(extension.getServerStatus())) {
          statusBarItem.text = '$(sync~spin) greet';
          globalDiagnostics[event.document.uri.fsPath] =
            await GreetFileController.analyzer(
              extension.getServerStatus(),
              diagnosticCollection,
              event.document,
            );
          statusBarItem.text = '$(check) greet';
        }
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
        } else if (
          await ServerStatusController.isStart(extension.getServerStatus())
        ) {
          statusBarItem.text = '$(sync~spin) greet';
          globalDiagnostics[document.uri.fsPath] =
            await GreetFileController.analyzer(
              extension.getServerStatus(),
              diagnosticCollection,
              document,
            );
          statusBarItem.text = '$(check) greet';
        }
      }
    },
  );
  context.subscriptions.push(disposableOpen);
}

export function deactivate() {
  //  extension.getServerStatus()?.setStatus('stop');
  ServerStatusController.stop(extension.getServerStatus());
}
