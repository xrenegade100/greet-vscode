import GreetIssue from './GreetIssue';

class GreetFile {
  private nome: string;

  private path: string;

  private greetIssue: GreetIssue[];

  constructor(nome: string, path: string, greetIssue: GreetIssue[]) {
    this.nome = nome;
    this.path = path;
    this.greetIssue = greetIssue;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getPath(): string {
    return this.path;
  }

  public setPath(path: string): void {
    this.path = path;
  }

  public getGreetIssue(): GreetIssue[] {
    return this.greetIssue;
  }

  public setGreetIssue(greetIssue: GreetIssue[]): void {
    this.greetIssue = greetIssue;
  }
}

export default GreetFile;
