class ServerStatus {
  private hostname: string;

  private port: number;

  private status: string | undefined;

  constructor(port: number = 19201, hostname: string = 'localhost') {
    this.hostname = hostname;
    this.port = port;
  }

  public getHostname(): string {
    return this.hostname;
  }

  public setHostname(hostname: string): void {
    this.hostname = hostname;
  }

  public getPort(): number {
    return this.port;
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public getStatus(): string | undefined {
    return this.status;
  }

  public setStatus(status: string) {
    this.status = status;
  }
}

export default ServerStatus;
