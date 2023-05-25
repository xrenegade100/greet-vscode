// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import RuntimeController from './controller/RuntimeController';

// eslint-disable-next-line no-unused-vars
export async function activate(context: vscode.ExtensionContext) {
  if (!RuntimeController.isInstalled()) {
    await RuntimeController.download();
  }
}

export function deactivate() {}
