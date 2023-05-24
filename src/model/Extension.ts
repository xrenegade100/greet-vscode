import FileManager from '../manager/FileManager';
import GreetFile from './GreetFile';
import ServerStatus from './ServerStatus';

class Extension {
  private static instance: Extension;

  private server?: ServerStatus;

  private fileManager?: FileManager;

  private greetFile?: Map<string, GreetFile>;

  private constructor(
    server?: ServerStatus,
    fileManager?: FileManager,
    greetFile?: Map<string, GreetFile>,
  ) {
    this.server = server;
    this.fileManager = fileManager;
    this.greetFile = greetFile;
  }

  public static getInstance(
    server?: ServerStatus,
    fileManager?: FileManager,
    greetFile?: Map<string, GreetFile>,
  ): Extension {
    if (!Extension.instance) {
      Extension.instance = new Extension(server, fileManager, greetFile);
    }
    return Extension.instance;
  }

  public getServerStatus(): ServerStatus | undefined {
    return this.server;
  }

  public setServerStatus(server: ServerStatus | undefined) {
    this.server = server;
  }

  public getFileManager(): FileManager | undefined {
    return this.fileManager;
  }

  public setFileManager(fileManager: FileManager | undefined) {
    this.fileManager = fileManager;
  }

  public getGreetFile(): Map<string, GreetFile> | undefined {
    return this.greetFile;
  }

  public setGreetFile(greetFile: Map<string, GreetFile> | undefined) {
    this.greetFile = greetFile;
  }
}

export default Extension;
