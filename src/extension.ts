import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	// Create a tree data provider for the view
	const treeDataProvider = new MyTreeDataProvider();
	var treeView = null;
	// for keeping track of decorations
	const decorationTypes: vscode.TextEditorDecorationType[] = [];
	
	let disposable = vscode.commands.registerCommand('go-to-symbol.helloWorld', () => {
		// create the sidebar
		treeView = vscode.window.createTreeView('my-view', {
			treeDataProvider : treeDataProvider,
			showCollapseAll: true,
			canSelectMany: true,
			manageCheckboxStateManually: false,
		});
		
		// Listen for selection
		treeView.onDidChangeSelection(event => {
			// get the selected object
			const selectedItems = event.selection as SymbolTreeItem[];
			let editor = vscode.window.activeTextEditor;
			const backgroundDecorationType = vscode.window.createTextEditorDecorationType({
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
			
			// each decoratino made needs to be keep tracked, so tha tyou can dispose it later	
			decorationTypes.push(backgroundDecorationType);
			
			if(!editor)
			{
				return;
			}
			
			if (selectedItems.length > 0)
			{
				const selectedLabel = selectedItems[0].label;
				if(selectedLabel == 'reset')
				{
					// Reset all decoration types to their default state
					for (const type of decorationTypes) {
						type.dispose();
					}
				}
				else // else, decorate them
				{
					// have to put as vscode.Range at behind else it will flag error
					const range = selectedItems[0].range as vscode.Range;
					const decoration = { range };
					editor.setDecorations(backgroundDecorationType, [decoration]);
					// editor.setDecorations(backgroundDecorationType, []); // Pass an empty array to remove all decorations
				}
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
		// for reseting decoration use
		arr.push(new SymbolTreeItem('reset', vscode.TreeItemCollapsibleState.None));
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
			var ranges: vscode.Range[] = [];
			var document = editor.document;
			var text = document.getText();
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

				let regex_whole = value.whole[0];
				let flag_whole = value.whole[1];
				let regex_name = value.name[0];
				let flag_name = value.name[1];
				let match = null;
				// a dynamic regex
				let _regex_whole = new RegExp(regex_whole, flag_whole);
				let _regex_name = new RegExp(regex_name, flag_name);

				while (match = _regex_whole.exec(text)) {
					const start = document.positionAt(match.index);
					const end = document.positionAt(match.index + match[0].length);
					const range:vscode.Range = new vscode.Range(start, end);
					// put these words into array
					// ranges.push(range);

					// editor.selection = new vscode.Selection(start, end);
					// editor.revealRange(range);
					raw_matches.push(match);
					
					for (let raw_match of raw_matches)
					{
						// _regex = /function\s+([a-zA-Z_][a-zA-Z_0-9]*)\s*\([^)]*\)\s*\{/;
						// let match = raw_match.toString().match(_regex);
						let match = _regex_name.exec(raw_match.toString());
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
						
						// push to array, this will show the list of symbols later
						arr.push(new SymbolTreeItem(
							``+match, 
							vscode.TreeItemCollapsibleState.None, 
							range));
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
		public readonly range?: vscode.Range,
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