/* eslint-disable operator-linebreak */
import * as fs from 'fs';
import AdmZip = require('adm-zip');
import * as path from 'path';

class FileManager {
  private static destinationFolder =
    process.platform === 'win32' ? process.env.APPDATA : process.env.HOME;

  public static async saveFile(response: any, filePath: string): Promise<void> {
    const fileStream = fs.createWriteStream(filePath);
    await new Promise<void>((resolve, reject) => {
      response.data.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    });
  }

  public static async unZipFolder(filePath: string): Promise<void> {
    const zip = new AdmZip(filePath);
    const zipFileName = path.basename(filePath, path.extname(filePath));
    const extractFolderPath = path.join(
      this.destinationFolder as string,
      zipFileName,
    );
    zip.extractAllTo(extractFolderPath, true);
    fs.unlinkSync(filePath);
  }
}

export default FileManager;
