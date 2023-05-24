import GreetIssueType from './GreetIssueType';

interface IGreetResponse {
  text: string;
  type: GreetIssueType;
  linestart: number;
  lineend: number;
  colstart: number;
  coleend: number;
}

class GreetIssue implements IGreetResponse {
  text: string;

  type: GreetIssueType;

  linestart: number;

  lineend: number;

  colstart: number;

  coleend: number;

  constructor(
    text: string,
    type: GreetIssueType,
    linestart: number,
    lineend: number,
    colstart: number,
    coleend: number,
  ) {
    this.text = text;
    this.type = type;
    this.linestart = linestart;
    this.lineend = lineend;
    this.colstart = colstart;
    this.coleend = coleend;
  }

  public getText(): string {
    return this.text;
  }

  public getType(): GreetIssueType {
    return this.type;
  }

  public getLineStart(): number {
    return this.linestart;
  }

  public getLineEnd(): number {
    return this.lineend;
  }

  public getColStart(): number {
    return this.colstart;
  }

  public getColEnd(): number {
    return this.coleend;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public setType(type: GreetIssueType): void {
    this.type = type;
  }

  public setLineStart(linestart: number): void {
    this.linestart = linestart;
  }

  public setLinEnd(lineend: number): void {
    this.lineend = lineend;
  }

  public setColStart(colstart: number): void {
    this.colstart = colstart;
  }

  public setColEnd(coleend: number): void {
    this.coleend = coleend;
  }
}

export default GreetIssue;
