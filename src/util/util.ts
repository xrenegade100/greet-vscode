// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';

export function isPythonFile(document: vscode.TextDocument): boolean {
  if (document.fileName.endsWith('.py')) {
    return true;
  }
  if (document.languageId === 'python') {
    return true;
  }
  return false;
}

// eslint-disable-next-line no-unused-vars
export function debounce(func: (...args: any[]) => void, delay: number) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timer | undefined;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = undefined;
    }, delay);
  };
}
