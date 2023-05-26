/* eslint-disable import/no-unresolved */
import * as vscode from 'vscode';
import axios from 'axios';
import ServerStatus from '../model/ServerStatus';
import GreetIssue from '../model/GreetIssue';
import GreetIssueType from '../model/GreetIssueType';

class GreetFileController {
  public static async analyzer(
    server: ServerStatus | undefined,
    diagnosticCollection: vscode.DiagnosticCollection,
    document: vscode.TextDocument,
  ): Promise<readonly vscode.Diagnostic[] | undefined> {
    try {
      const response = await axios.post(
        `http://${server?.getHostname()}:${server?.getPort()}/predict`,
        {
          code: document.getText(),
        },
      );

      if (response.data) {
        const greetIssue: GreetIssue[] = this.fromResponse(response.data);
        diagnosticCollection.set(document.uri, this.report(greetIssue));
        return diagnosticCollection.get(document.uri);
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        'Error during greet analysis, possibly due to a lack of server connection.',
      );
      throw new Error(
        'Error during greet analysis, possibly due to a lack of server connection.',
      );
    }
    return undefined;
  }

  private static report(greetIssue: GreetIssue[]) {
    const diagnostics: vscode.Diagnostic[] = [];
    greetIssue.forEach((entity) => {
      let message = '';
      switch (entity.type) {
        case GreetIssueType.METHODOPPOSITECOMMENT:
          message = 'Method signature and comment are opposite';
          break;
        case GreetIssueType.ATTRIBUTEOPPOSITECOMMENT:
          message = 'Attribute signature and comment are opposite';
          break;
        case GreetIssueType.NOTIMPLEMENTEDCONDITION:
          message = 'Not implemented condition';
          break;
        case GreetIssueType.GETMORETHENACCESSOR:
          message = 'Get more then accessor';
          break;
        default:
          break;
      }
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(
          new vscode.Position(entity.linestart, entity.colstart),
          new vscode.Position(entity.lineend, entity.coleend),
        ),
        `${message}`,
        vscode.DiagnosticSeverity.Information,
      );
      diagnostic.source = '(greet)';
      diagnostic.code = entity.type;
      diagnostics.push(diagnostic);
    });
    return diagnostics;
  }

  private static fromResponse(response: any): GreetIssue[] {
    const arrayPredictions: GreetIssue[] = [];
    response.forEach((entity: any) => {
      let type: GreetIssueType = GreetIssueType.CLEAR;
      switch (entity.prediction) {
        case 0:
          type = GreetIssueType.METHODOPPOSITECOMMENT;
          break;
        case 1:
          type = GreetIssueType.ATTRIBUTEOPPOSITECOMMENT;
          break;
        case 2:
          type = GreetIssueType.CLEAR;
          break;
        case 3:
          type = GreetIssueType.NOTIMPLEMENTEDCONDITION;
          break;
        case 4:
          type = GreetIssueType.GETMORETHENACCESSOR;
          break;
        default:
          break;
      }
      if (type !== GreetIssueType.CLEAR) {
        arrayPredictions.push({
          ...entity,
          type,
          lineend: entity.lineend - 1,
          linestart: entity.linestart - 1,
        });
      }
    });
    return arrayPredictions;
  }
}

export default GreetFileController;
