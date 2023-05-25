/* eslint-disable import/no-unresolved */
/* eslint-disable operator-linebreak */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import FileManager from '../manager/FileManager';

class RuntimeController {
  private static urlInstallWin =
    'https://huggingface.co/mantra-coding/greet-runtime/resolve/main/greet-vscode-server-runtime-win.zip';

  private static urlInstallLinux =
    'https://huggingface.co/mantra-coding/greet-runtime/resolve/main/greet-vscode-server-runtime-linux.zip';

  // private static urlModel = "https://huggingface.co/mantra-coding/alBERTo/resolve/main/alBERTo-v1.0.0";

  private static urlModel =
    'https://huggingface.co/mantra-coding/greet-runtime/resolve/main/greet-vscode-server-runtime-win.zip';

  private static destinationFolder =
    process.platform === 'win32' ? process.env.APPDATA : process.env.HOME;

  public static async download() {
    const fileName = path.basename(
      process.platform === 'win32' ? this.urlInstallWin : this.urlInstallLinux,
    );
    const filePath = path.join(this.destinationFolder as string, fileName);
    await axios
      .get(
        process.platform === 'win32'
          ? this.urlInstallWin
          : this.urlInstallLinux,
        {
          responseType: 'stream',
        },
      )
      .then(async (response) => {
        fs.mkdirSync(this.destinationFolder as string, { recursive: true });
        await FileManager.saveFile(response, filePath).then(async () => {
          await FileManager.unZipFolder(filePath).then(async () => {
            await axios
              .get(this.urlModel, {
                responseType: 'stream',
              })
              .then(async (responseModel) => {
                await FileManager.saveFile(
                  responseModel,
                  `${filePath.substring(
                    0,
                    filePath.length - 4,
                  )}\\src\\greet_predictor_module\\greet`,
                );
              })
              .catch(() => {
                vscode.window.showErrorMessage(
                  'Error during extension installation, possibly due to a lack of internet connection. Please try again.',
                );
              });
          });
        });
      })
      .catch(() => {
        vscode.window.showErrorMessage(
          'Error during extension installation, possibly due to a lack of internet connection. Please try again.',
        );
      });
  }

  public static isInstalled(): boolean {
    const fileName = path.basename(
      process.platform === 'win32' ? this.urlInstallWin : this.urlInstallLinux,
    );
    const filePath = path.join(this.destinationFolder as string, fileName);
    if (fs.existsSync(filePath.substring(0, filePath.length - 4))) {
      return true;
    }
    return false;
  }
}

export default RuntimeController;
