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
		treeView = vscode.window.createTreeView('my-view', {
			treeDataProvider : treeDataProvider,
			showCollapseAll: true,
			canSelectMany: true,
			manageCheckboxStateManually: false,
		});
		
		// Listen for selection
		treeView.onDidChangeSelection(event => {
			const selectedItems = event.selection as SymbolTreeItem[];
			if (selectedItems.length > 0) {
				const selectedLabel = selectedItems[0].label;
				vscode.window.showInformationMessage(`Selected tree item: ${selectedLabel}`);
			}
		});
		
	});
	context.subscriptions.push(disposable);
	

}
  
// Define a class for the tree data provider
class MyTreeDataProvider implements vscode.TreeDataProvider<SymbolTreeItem> {
	// Implement the getChildren method
	getChildren(element?: SymbolTreeItem): Thenable<SymbolTreeItem[]> {

		let editor = vscode.window.activeTextEditor;
		// raw means unfiltered, contains many char that you dont want to show in the tree list
		let raw_matches = [];
		// matches means filtered, only show the name of the matched string, this is the one you want to show on the tree list
		let matches = [];
		let arr = [];

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
			var symbolType = null;
			// have to put 'any', else this variable will have type 'unknown'
			// then later loop will have error
			// if dont want to put 'any', later in loop can put 'as any'
			let entries:any = Object.entries(data);
			/*
			{
				"function" : {
					"a" : 1
				}
			}
			key = function
			value = {"a" : 1}
			*/
			for (const [key, value] of entries) {
				symbolType = key;
				// show type, eg: function, macro, struct, etc
				arr.push(new SymbolTreeItem(symbolType, vscode.TreeItemCollapsibleState.None));
				// u can put 'as any' at behind to solve type is 'unknown' error
				// value = {"a" : [1,2]}
				// k = "a"
				// value[k][0] = 1
				// value[k][1] = 2
				for (const k in value)
				{
					let regex = value[k][0];
					let flag = value[k][1];
					let match = null;
					// a dynamic regex
					let _regex = new RegExp(regex, flag);
	
					if(k.toLocaleLowerCase().includes("whole"))
					{
						while (match = _regex.exec(text)) {
							const start = document.positionAt(match.index);
							const end = document.positionAt(match.index + match[0].length);
							const range = new vscode.Range(start, end);
							// put these words into array
							ranges.push(range);

							const blueBackgroundDecorationType = vscode.window.createTextEditorDecorationType({
								// the last element is the opacity
								backgroundColor: 'rgba(154, 154, 156, 0.3)',
								// this opacity appleis to the text instead of the background color
								// opacity: '0',
								// this can be seen on minimap, the small block colors
								overviewRulerColor: '#02fa0f', // green
								// to show the block color on the right
								overviewRulerLane: vscode.OverviewRulerLane.Full,
								// minimapColor: 'red' // this color will be used in the minimap
							  });

							const decoration = { range };
							editor.setDecorations(blueBackgroundDecorationType, [decoration]);
							



							// editor.selection = new vscode.Selection(start, end);
							// editor.revealRange(range);
							raw_matches.push(match);
						}
					}
					
					// only push to array if the JSON 'key' contains this word
					// thus, only these keys will be shown on the tree list
					if(k.toLocaleLowerCase().includes("name"))
					{
						for (let raw_match of raw_matches)
						{
							// _regex = /function\s+([a-zA-Z_][a-zA-Z_0-9]*)\s*\([^)]*\)\s*\{/;
							// let match = raw_match.toString().match(_regex);
							let match = _regex.exec(raw_match.toString());
							// put these words into array
							if(match)
							{
								// if you set breakpoint and investigate the value
								// [1] holds the value of function name only
								matches.push(match[1])
							}
							else
							{
								matches.push('anonymous');
							}

							arr.push(new SymbolTreeItem(``+match, vscode.TreeItemCollapsibleState.None, ranges));
						}
					}
				}
			}
		}
		else
		{
			vscode.window.showInformationMessage('No language detected');
		}

		for (let match of matches) {
			// add items to the array
		}
		// Return an array of tree items
		return Promise.resolve(arr);
	}

	// Implement the getTreeItem method
	getTreeItem(element: SymbolTreeItem): vscode.TreeItem {
		// Return the element as a tree item
		return element;
	}
}

// this class holds the detail of list of symbols that regex matches
// one symbol for 1 class
class SymbolTreeItem extends vscode.TreeItem {
	constructor(
		// this is the string that appear on the tree list
		public readonly label: string,
		// whether they collapse or not, hold `CTRL`, hover over TreeItemCollapsibleState to see more
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly range?: vscode.Range[],
		public readonly id?: string,
		public readonly command?: vscode.Command,
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