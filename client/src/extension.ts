import * as path from 'path'
import {
  workspace,
  ExtensionContext,
  languages,
  TextDocument,
  Hover,
} from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Position,
  CancellationToken,
} from 'vscode-languageclient'

let client: LanguageClient
let source: string

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerHoverProvider('thrift', {
      provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
      ) {
        const text = document.getText()
        if (text === source) {
        }

        return new Hover('test')
      },
    }),
  )

  // The server is implemented in node
  let serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js'),
  )
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  }

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: 'file', language: 'thrift' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
    outputChannelName: 'xxx',
  }

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Language Server Example',
    serverOptions,
    clientOptions,
  )

  // Start the client. This will also launch the server
  client.start()
}

export function deactivate(): Thenable<void> {
  if (!client) {
    return undefined
  }
  return client.stop()
}
