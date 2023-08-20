// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AbstractGotoSymbolQuickAccessProvider, IGotoSymbolQuickPickItem} from './gotoSymbolQuickAccess'

import { IDiffEditor, IEditor, ScrollType } from 'vs/editor/common/editorCommon';
import { IKeyMods, IQuickPick, IQuickPickItem } from 'vs/platform/quickinput/common/quickInput';
import { CancellationToken } from 'vs/base/common/cancellation';
import { DisposableStore, IDisposable, MutableDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { getCodeEditor, isDiffEditor } from 'vs/editor/browser/editorBrowser';
import { IQuickAccessTextEditorContext } from 'vs/editor/contrib/quickAccess/browser/editorNavigationQuickAccess';
import { CancellationTokenSource } from 'vs/base/common/cancellation';
import { Event } from 'vs/base/common/event';
import { ICodeEditorService } from 'vs/editor/browser/services/codeEditorService';
import { ILanguageFeaturesService } from 'vs/editor/common/services/languageFeatures';
import { IOutlineModelService } from 'vs/editor/contrib/documentSymbols/browser/outlineModel';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';


export function activate(context: vscode.ExtensionContext) {
	// Create a tree data provider for the view
	const treeDataProvider = new MyTreeDataProvider();
	// Register the view with the tree data provider
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	// const aa = createDecorator<ILanguageFeaturesService>('ILanguageFeaturesService');
	// const _languageFeaturesService: ILanguageFeaturesService = null;
	const me = new MyClass(new ILanguageFeaturesService(), new IOutlineModelService());
	console.log('Congratulations, your extension "go-to-symbol" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-to-symbol.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.registerTreeDataProvider('my-view', treeDataProvider);
		vscode.window.showInformationMessage('Hello World from go to symbol!');
	});

	context.subscriptions.push(disposable);

}

class MyClass extends AbstractGotoSymbolQuickAccessProvider{
	
	constructor(
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IOutlineModelService outlineModelService: IOutlineModelService,
	) {
		super(languageFeaturesService, outlineModelService);
	}

	test(){
		const source = new CancellationTokenSource();
		const token = source.token;
		const editor = this.activeTextEditorControl;
		if(editor)
		{
			const context: IQuickAccessTextEditorContext = { editor };
			const model = this.getModel(context.editor);
			if(model)
			{
				const symbolsPromise = this.getDocumentSymbols(model, token);
				console.log(symbolsPromise);
			}
		}
	}
	protected activeTextEditorControl: IEditor | undefined;
	protected readonly onDidActiveTextEditorControlChange = Event.None;
}

// Define a class for the tree data provider
class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
	// Implement the getChildren method
	getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
		// Return an array of tree items
		return Promise.resolve([
		new MyTreeItem('Item 1', vscode.TreeItemCollapsibleState.None),
		new MyTreeItem('Item 2', vscode.TreeItemCollapsibleState.None),
		new MyTreeItem('Item 3', vscode.TreeItemCollapsibleState.None)
		]);
	}

	// Implement the getTreeItem method
	getTreeItem(element: MyTreeItem): vscode.TreeItem {
		// Return the element as a tree item
		return element;
	}
}

// Define a class for the tree items
class MyTreeItem extends vscode.TreeItem {
	constructor(
		public override readonly label: string,
		public override readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public override readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}
}