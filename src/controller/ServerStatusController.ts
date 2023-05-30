import * as path from 'path';
import * as childProcess from 'child_process';
import axios from 'axios';
import { chmodSync } from 'fs';
import ServerStatus from '../model/ServerStatus';

class ServerStatusController {
  public static start(): boolean {
    const greetCmdPath = path.join(
      (process.platform === 'win32'
        ? process.env.APPDATA
        : process.env.HOME) as string,
      process.platform === 'win32'
        ? 'greet-cli-win-0.0.1-alpha.1'
        : 'greet-cli-linux-0.0.1-alpha.1',
      process.platform === 'win32' ? 'greet.cmd' : 'greet.sh',
    );
    const greetCmdDirectory = path.dirname(greetCmdPath);

    process.chdir(greetCmdDirectory);
    chmodSync(greetCmdPath, 0o755);

    childProcess.exec(`${greetCmdPath} -s`, (err) => {
      console.log(err);
    });
    return true;
  }

  public static async stop(server: ServerStatus | undefined): Promise<void> {
    server?.setStatus('stop');
    await axios.get(
      `http://${server?.getHostname()}:${server?.getPort()}/quit`,
    );
  }

  public static async isStart(
    // eslint-disable-next-line no-unused-vars
    server: ServerStatus | undefined,
  ): Promise<boolean> {
    const response = await axios
      .get(`http://${server?.getHostname()}:${server?.getPort()}/status`)
      .catch(() => {});
    if (response !== undefined) {
      return true;
    }
    return false;
  }
}

export default ServerStatusController;
