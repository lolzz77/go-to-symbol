import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	// Create a tree data provider for the view
	const treeDataProvider = new MyTreeDataProvider();
	var treeView = null;
	// for keeping track of decorations
	const decorationTypes: vscode.TextEditorDecorationType[] = [];
	
	let disposable = vscode.commands.registerCommand('go-to-symbol.activate', () => {
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
				backgroundColor: 'rgba(154, 154, 156, 0.1)', // grey
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
				else
				{
					// decorate the selected items

					// have to put as vscode.Range at behind else it will flag error
					const range = selectedItems[0].range as vscode.Range;
					const decoration = { range };
					editor.setDecorations(backgroundDecorationType, [decoration]);

					// move the cursor to the location

					const newSelection = new vscode.Selection(range.start, range.start);
					editor.selection = newSelection;
					// Reveal the range in the editor
					editor.revealRange(range);
				}
			}
		});
		
	});

	// detect if you selected other editors (eg: different files)
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			// if you changed, then execute the command again
			vscode.commands.executeCommand('go-to-symbol.activate');
		}
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
			console.log('Language: ' + language);
			// vscode.window.showInformationMessage('Language: ' + language);
			let JSONPath = getJSONPath(language);
			console.log('JSON Path: ' + JSONPath);
			// vscode.window.showInformationMessage('JSON Path: ' + JSONPath);

		
			language = getCurrentActiveEditorLanguage();


			/*********************************************************** 
			************************* DEBUG ****************************
			***********************************************************/
			// change `getJSONPath(language);` to `getJSONPath(null);`
			// so it will look for default.json

			JSONPath = getJSONPath(language);
			let data = getJSONData(JSONPath);
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
					"a" : 1,
					"b" : 2
				}
			}
			key = function
			value = {"a" : 1, "b" : 2}
			*/
			for (const [key, value] of entries) {
				symbolType = key;
				// show type, eg: function, macro, struct, etc
				arr.push(new SymbolTreeItem(symbolType, vscode.TreeItemCollapsibleState.None));
				

				let position_arr = [];
				let start_index = null;
				let end_index = null;

				if(	symbolType == 'function' || symbolType == 'class' || symbolType == 'struct' ||
					symbolType == 'enum')
				{
					let regex_whole = value.whole[0];
					let flag_whole = value.whole[1];
					let keys = Object.keys(value);
					let keyword_to_search_for_symbol = null;
					position_arr = [];

					// some need to search the symbol BEFORE the char
					// some need to search the symbol AFTER the char
					if(keys.includes("before"))
						keyword_to_search_for_symbol = value.before;
					else
						keyword_to_search_for_symbol = value.after;

					let function_opening = value.opening[0];
					let function_closing = value.opening[1];
					let match = null;
					// a dynamic regex
					let _regex_whole = new RegExp(regex_whole, flag_whole);
					
					if(regex_whole == '')
						break;
					

					while (match = _regex_whole.exec(text)) {
						
						// to extract the function name
						
						start_index = 0;
						end_index = 0;
						// for checking whether the current index has found the 1st character or not
						let hasFountFirstChar = false;
						let str = match.toString();
						let sub = null;

						if(keys.includes("before"))
							sub = str.substring(0, str.indexOf(keyword_to_search_for_symbol));
						else
							sub = str.substring(str.indexOf(keyword_to_search_for_symbol));

						let index = -1; // start with invalid index
						let i = sub.length - 1; // point to the last character
						// Loop through the string backwards
						while (i >= 0) 
						{
							let char = sub.charAt(i); // Get the character at the current index
							if (char === " " && hasFountFirstChar) 
							{ 	// Check if the character is a white space
								index = i; // Update the index
								break;
							}
							/*
							* because there are some cases like this
							* int main (...)
							* there's white space before the `(`
							*/
							else if (!isNaN(Number(char))) // isNaN = is not a number
							{
								hasFountFirstChar = true;
							}
							else if ((char.match(/[a-z]/i))) // if is alphabet
							{
								hasFountFirstChar = true;
							}
							i--;
						}
						// save the start index
						// + 1, because the current index is pointing to white spaces
						start_index = index + 1;
						// get the substring, starting from the given start index
						let function_name = sub.substring(start_index);
						


						// find the whole function body, using depth method

						
						// my regex only match until the 1st opening, thus, set depth starting at 1
						let depth = 1;
						// these ranges are used for highlighting the background
						// store value first
						const start = document.positionAt(match.index);
						var end = document.positionAt(match.index + match[0].length);
						
						let doc = editor.document;
						index = doc.offsetAt(end); // get the index from the position
						start_index = index;
						let pos = doc.positionAt(index); // get the position
						let char = doc.getText(new vscode.Range(pos, pos.translate(0, 1))); // get the character
						while (depth != 0) 
						{
							if(char === function_opening)
							depth++;
							else if(char === function_closing)
								depth--;

							if(depth==0)
								break;
							index++;
							pos = doc.positionAt(index); // get the next position
							char = doc.getText(new vscode.Range(pos, pos.translate(0, 1))); // get the next character
						}
						end_index = index;
						// update the end position again
						// match.index - the starting index that my regex matches it
						// index - match.index - the length of the function body
						end = document.positionAt(match.index + (index-match.index));
						// construct the range
						const range = new vscode.Range(start, end);
						// for javascript, they have anonymous function
						if(function_name == null || function_name == '')
						{
							function_name = 'anonymous'
						}
						
						// push to array, this will show the list of symbols later
						arr.push(new SymbolTreeItem(
							``+function_name, 
							vscode.TreeItemCollapsibleState.None, 
							range));

							position_arr.push([start_index, end_index]);
					}

				}
				else // for those that dont need '{}' depth handling
				{
					let regex_whole = value.whole[0];
					let flag_whole = value.whole[1];
					let match = null;
					// a dynamic regex
					let _regex_whole = new RegExp(regex_whole, flag_whole);
					position_arr = [];




					let keys = Object.keys(value);
					let keyword_to_search_for_symbol = null;
					if(keys.includes("before"))
						keyword_to_search_for_symbol = value.before;
					else
						keyword_to_search_for_symbol = value.after;
					


					if(regex_whole == '')
						break;
					
					while (match = _regex_whole.exec(text)) {
						
						// to extract the function name
	
						start_index = 0;
						end_index = 0;
						// for checking whether the current index has found the 1st character or not
						let hasFountFirstChar = false;
						let str = match.toString();
						let sub = null;
						let index = null;

						if(keys.includes("before"))
						{
							sub = str.substring(0, str.indexOf(keyword_to_search_for_symbol));
							index = -1; // start with invalid index
							let i = sub.length - 1; // point to the last character
							// Loop through the string backwards
							while (i >= 0) 
							{
								let char = sub.charAt(i); // Get the character at the current index
								if (char === " " && hasFountFirstChar) 
								{ 	// Check if the character is a white space
									index = i; // Update the index
									break;
								}
								/*
								* because there are some cases like this
								* int main (...)
								* there's white space before the `(`
								*/
								else if (!isNaN(Number(char))) // isNaN = is not a number
								{
									hasFountFirstChar = true;
								}
								else if ((char.match(/[a-z]/i))) // if is alphabet
								{
									hasFountFirstChar = true;
								}
								i--;
							}
							// save the start index
							// + 1, because the current index is pointing to white spaces
							start_index = index + 1;
						}
						else
						{
							sub = str.substring(str.indexOf(keyword_to_search_for_symbol));
							index = -1; // start with invalid index
							let i = 0; // point to the first character
							// Loop through the string forward
							while (i < sub.length) 
							{
								let char = sub.charAt(i); // Get the character at the current index
								if (char === " " && hasFountFirstChar) 
								{ 	// Check if the character is a white space
									index = i; // Update the index
									break;
								}
								/*
								* because there are some cases like this
								* int main (...)
								* there's white space before the `(`
								*/
								else if (!isNaN(Number(char))) // isNaN = is not a number
								{
									hasFountFirstChar = true;
								}
								else if ((char.match(/[a-z]/i))) // if is alphabet
								{
									hasFountFirstChar = true;
								}
								i++;
							}
							// save the start index
							// + 1 because currently the index is pointing to the white space
							start_index = index + 1;
						}
					
						
						// get the substring, starting from the given start index
						let symbol_name = sub.substring(start_index);
						
						const start = document.positionAt(match.index);
						const end = document.positionAt(match.index + match[0].length);
						const range = new vscode.Range(start, end);

						// push to array, this will show the list of symbols later
						arr.push(new SymbolTreeItem(
							``+symbol_name, 
							vscode.TreeItemCollapsibleState.None, 
							range));
					}

				}
				// remove the content i dont need in text buffer
				// have to do it after the while loop
				// else, u will affect the iterator
				let prev_length = 0;
				for (let [start_index, end_index] of position_arr)
				{
					// after you removed the strings, the indexes needs to be recalculated
					start_index -= prev_length;
					end_index -= prev_length;
					text = text.substring(0, start_index) + '' + text.substring(end_index);
					prev_length = end_index - start_index;
				}
			}
		}
		else
		{
			vscode.window.showInformationMessage('No language detected');
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