import ServerStatus from './ServerStatus';

class Extension {
  private static instance: Extension;

  private server?: ServerStatus;

  private constructor(server?: ServerStatus) {
    this.server = server;
  }

  public static getInstance(server?: ServerStatus): Extension {
    if (!Extension.instance) {
      Extension.instance = new Extension(server);
    }
    return Extension.instance;
  }

  public getServerStatus(): ServerStatus | undefined {
    return this.server;
  }

  public setServerStatus(server: ServerStatus | undefined) {
    this.server = server;
  }
}

export default Extension;
