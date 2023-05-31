/* eslint-disable import/no-unresolved */
/* eslint-disable operator-linebreak */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import axios from 'axios';
import FileManager from '../manager/FileManager';

class RuntimeController {
  private static urlInstallWin =
    'https://huggingface.co/mantra-coding/greet-runtime/resolve/main/greet-cli-win-0.0.1-alpha.1.zip';

  private static urlInstallLinux =
    'https://huggingface.co/mantra-coding/greet-runtime/resolve/main/greet-cli-linux-0.0.1-alpha.1.zip';

  private static urlModel =
    'https://huggingface.co/mantra-coding/alBERTo/resolve/main/alBERTo-v1.0.0';

  private static destinationFolder =
    process.platform === 'win32' ? process.env.APPDATA : process.env.HOME;

  public static async downloadRuntime() {
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
          await FileManager.unZipFolder(filePath);
        });
      })
      .catch(() => {
        vscode.window.showErrorMessage(
          'Error during extension installation, possibly due to a lack of internet connection. Please try again.',
        );
        throw new Error('Error during extension installation.');
      });
  }

  public static async downloadModel() {
    await axios
      .get(this.urlModel, {
        responseType: 'stream',
      })
      .then(async (responseModel) => {
        fs.mkdirSync(path.join(os.homedir(), '.greet'), {
          recursive: true,
        });
        await FileManager.saveFile(
          responseModel,
          path.join(os.homedir(), '.greet', 'greet'),
        );
      })
      .catch((err) => {
        console.log(err);
        vscode.window.showErrorMessage(
          'Error during extension installation, possibly due to a lack of internet connection. Please try again.',
        );
        throw new Error('Error during extension installation.');
      });
  }

  public static isInstalledRuntime(): boolean {
    const fileName = path.basename(
      process.platform === 'win32' ? this.urlInstallWin : this.urlInstallLinux,
    );
    const filePath = path.join(this.destinationFolder as string, fileName);
    if (fs.existsSync(filePath.substring(0, filePath.length - 4))) {
      return true;
    }
    return false;
  }

  public static isInstalledModel(): boolean {
    if (fs.existsSync(path.join(os.homedir(), '.greet', 'greet'))) {
      return true;
    }
    return false;
  }
}

export default RuntimeController;
