// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	// Create a tree data provider for the view
	const treeDataProvider = new MyTreeDataProvider();
	var treeView = null;
	// Register the view with the tree data provider
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-to-symbol" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-to-symbol.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.registerTreeDataProvider('my-view', treeDataProvider);
		treeView = treeDataProvider.getTreeItem();
		
		
	});
	context.subscriptions.push(disposable);
	
	if(treeView)
	{
		// Listen for selection changes
		treeView.onDidChangeSelection(event => {
			const selectedItems = event.selection as MyTreeItem[];
			if (selectedItems.length > 0) {
				const selectedLabel = selectedItems[0].label;
				vscode.window.showInformationMessage(`Selected tree item: ${selectedLabel}`);
			}
		});
	}

}
  
// Define a class for the tree data provider
class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
	// Implement the getChildren method
	getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {

		let editor = vscode.window.activeTextEditor;
		let matches = [];

		if (editor) {
			// display the JSON file path that this extension will be searching for
			// display the current active editor
			let language = getCurrentActiveEditorLanguage();
			vscode.window.showInformationMessage('Language: ' + language);
			let JSONPath = getJSONPath(null);
			vscode.window.showInformationMessage('JSON Path: ' + JSONPath);

		
			language = getCurrentActiveEditorLanguage();
			// for now, just make it to default.json first
			JSONPath = getJSONPath(null);
			let data = getJSONData(JSONPath);
		
			var document = editor.document;
			var text = document.getText();
			var ranges: vscode.Range[] = [];
			let objects = Object.keys(data);
			const regexPattern = data.function;
			for (let object of objects) {
				let regex = data[object];
				let match = null;
				// a dynamic regex
				let _regex = new RegExp(regex, 'g');
				while (match = _regex.exec(text)) {
					console.log(match);

					const start = document.positionAt(match.index);
					const end = document.positionAt(match.index + match[0].length);
					const range = new vscode.Range(start, end);
					// put these words into array
					ranges.push(range);
					matches.push(match)
					editor.selection = new vscode.Selection(start, end);
					editor.revealRange(range);
				}
			}
		}
		else
		{
			vscode.window.showInformationMessage('No language detected');
		}
		let arr = [];
		for (let match of matches) {
			// add items to the array
			arr.push(new MyTreeItem(``+match, vscode.TreeItemCollapsibleState.None));
		}
		// Return an array of tree items
		return Promise.resolve(arr);
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
		// this is the string that appear on the tree list
		public readonly label: string,
		// whether they collapse or not, hold `CTRL`, hover over TreeItemCollapsibleState to see more
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly id?: string,
		public readonly command?: vscode.Command
		// public readonly iconPath: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;
	) {
		super(label, collapsibleState);
	}
}





















// Get the JSON File
function getJSONData(JSONPath: string): any {
	let fileContents = fs.readFileSync(JSONPath, "utf8");
	let data: any = JSON.parse(fileContents);
	return data;
}

// To get the JSON file path that the extension will be looking
// This JSON describe what keyword to recolor
function getJSONPath(language: string|null): string {
	// if language passed in is null, then set it to 'default.json'
	if(language == null)
		language = 'default'
	return vscode.env.appRoot + '/go-to-symbol/' + language + '.json';
}

// To get the current active editor language
function getCurrentActiveEditorLanguage(): string {
	let language;
	let editor = vscode.window.activeTextEditor;
	
	if (editor) {
		language = editor.document.languageId;
	}
	else
	{
		language = 'No language detected';
	}

	return language;
}