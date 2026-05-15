const cp = require('child_process');
const path = require('path');
const vscode = require('vscode');

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: 'go', scheme: 'file' },
      { provideDocumentFormattingEdits: formatDocument }
    )
  );
}

async function formatDocument(document) {
  const formatted = await runFormatter(document);
  const lastLine = document.lineAt(document.lineCount - 1);
  const fullRange = new vscode.Range(
    new vscode.Position(0, 0),
    lastLine.rangeIncludingLineBreak.end
  );
  return [vscode.TextEdit.replace(fullRange, formatted)];
}

function runFormatter(document) {
  const config = vscode.workspace.getConfiguration('golandGoFormatter', document.uri);
  const tool = config.get('tool', 'gofmt');
  const extraArgs = config.get('extraArgs', []);
  const timeoutMs = config.get('timeoutMs', 10000);
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : path.dirname(document.uri.fsPath);

  return new Promise((resolve, reject) => {
    const child = cp.spawn(tool, extraArgs, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${tool} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(new Error(`${tool} failed to start: ${error.message}`));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
        return;
      }
      reject(new Error((stderr || `${tool} exited with code ${code}`).trim()));
    });

    child.stdin.end(document.getText());
  });
}

function deactivate() {}

module.exports = { activate, deactivate };
