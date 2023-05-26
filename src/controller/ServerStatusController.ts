import * as path from 'path';
import * as childProcess from 'child_process';

class ServerStatusController {
  public static start(): boolean {
    const greetCmdPath = path.join(
      (process.platform === 'win32'
        ? process.env.APPDATA
        : process.env.HOME) as string,
      process.platform === 'win32'
        ? 'greet-vscode-server-runtime-win'
        : 'greet-vscode-server-runtime-linux',
      process.platform === 'win32' ? 'greet.cmd' : 'greet.sh',
    );
    const greetCmdDirectory = path.dirname(greetCmdPath);

    process.chdir(greetCmdDirectory);

    childProcess.exec(greetCmdPath, (err) => {
      console.log(err);
    });

    // TO DO Check if the server is started

    return true;
  }

  public static stop(): boolean {
    return true;
  }

  public static isStart(): boolean {
    return true;
  }
}

export default ServerStatusController;
