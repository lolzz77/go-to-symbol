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
			const selectedLabel = selectedItems[0].label;
			let editor = vscode.window.activeTextEditor;
			const backgroundDecorationType = vscode.window.createTextEditorDecorationType({
				// the last element is the opacity
				backgroundColor: 'rgba(154, 154, 156, 0.2)', // grey
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
			
			if (selectedItems.length == 0)
			{
				return;
			}

			if(selectedLabel == 'reset')
			{
				resetDecoration(decorationTypes);
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
		let treeArr = [];
		// for reseting decoration use
		treeArr.push(new SymbolTreeItem('reset', vscode.TreeItemCollapsibleState.None));

		if(!editor)
		{
			vscode.window.showInformationMessage('No language detected');
			return Promise.resolve(treeArr);
		}

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
		let to_repalce = '';
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

			if (symbolType != 'comment')
			{
				// show type, eg: function, macro, struct, etc
				treeArr.push(new SymbolTreeItem(symbolType, vscode.TreeItemCollapsibleState.None));
			}

			let position_arr = [];
			let start_index = null;
			let end_index = null;
			to_repalce = '';
			if (symbolType == 'comment')
			{
				let regex_whole = value.whole[0];
				let flag_whole = value.whole[1];
				let match = null;
				let symbol_name = null;
				// a dynamic regex
				let _regex_whole = new RegExp(regex_whole, flag_whole);
				position_arr = [];

				if(regex_whole == '')
					break;
				
				while (match = _regex_whole.exec(text)) {
					start_index = 0;
					end_index = 0;
					const start = document.positionAt(match.index);
					const end = document.positionAt(match.index + match[0].length);
					const range = new vscode.Range(start, end);

					to_repalce = document.getText(range);
					position_arr.push(to_repalce);
				}
			}
			else if( symbolType == 'function' || symbolType == 'class' || symbolType == 'struct' ||
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
					

					/**********************************************************************
					 to extract the function name
					***********************************************************************/
					// actually, the `match` is an array, match[1] holds the function name
					// however, this algorithm applies got struct, enum those as well
					// thus, tho you can do function_name = match[1]
					// is better do manually, so that it applies to all cases



					start_index = 0;
					end_index = 0;
					// for checking whether the current index has found the 1st character or not
					let hasFountFirstChar = false;
					let str = match.toString();
					let sub = null;
					let function_name = null;
					let index = null;
					let i = null; // for loop
					
					// given keyword, get substring
					if(keys.includes("before"))
						sub = str.substring(0, str.indexOf(keyword_to_search_for_symbol));
					else
						sub = str.substring(str.indexOf(keyword_to_search_for_symbol));

					index = -1; // start with invalid index
					i = sub.length - 1; // point to the last character
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
					function_name = sub.substring(start_index);
					// remove white spaces
					function_name = function_name.replace('\\s*', '');
					// remove '\n' characters
					function_name = function_name.replace('\n', '');
					

					/**********************************************************************
					Given the pattern, get the original document position
					***********************************************************************/
					// because currently your 'text' has been modified
					// where, you erased those that matched pattern,
					// to make way for next regex to detect pattern
					// to not make the regex detect duplicate pattern

					let temp_doc = editor.document;
					let temp_text = temp_doc.getText();
					let temp_match = null;
					// have to use another regex, 
					// if reuse the existing regex, it will continue the next pattern
					let temp_regex_whole = new RegExp(regex_whole, flag_whole);

					// to capture regex on the original document
					while( temp_match = temp_regex_whole.exec(temp_text) )
					{
						// if match with current matched pattern, 
						// means this pattern is not a duplicate
						if (temp_match[0] == match[0])
							break;
					}

					// fail safe check, 
					// if pattern not found on original document, dont proceed
					if (!temp_match)
					{
						continue;
					}



					/**********************************************************************
					find the whole function body, using depth method
					***********************************************************************/


					// First, make sure the regex that matches the pattern,
					// matches the whole thing properly, like, at the start of the string
					

					// search the function backwards


					let start = document.positionAt(temp_match.index);
					let end = null;
					index = document.offsetAt(start); // get the index from the position
					start_index = index;
					let pos = document.positionAt(index); // get the position
					let char = document.getText(new vscode.Range(pos, pos.translate(0, 1))); // get the character

					// match.index == 0 refers that this is the beginning of the document,
					// you can go backwards anymore, this is the 1st index of document
					// i wanted it to stop when match new line '\n', but apparently, it just ''
					while(temp_match.index != 0 && char != '')
					{
						index--;
						pos = document.positionAt(index); // get the position
						char = document.getText(new vscode.Range(pos, pos.translate(0, 1)));
					}
					index++;


					
					// now, search the rest of the function forward


					// my regex only match until the 1st opening, thus, set depth starting at 1
					// i cannot do regex that matches whole function body
					// the best i can do is match til the 1st encounter of '}'
					let depth = 1;
					// these ranges are used for highlighting the background
					// store value first
					start = document.positionAt(index);
					end = document.positionAt(temp_match.index + temp_match[0].length);
					
					index = document.offsetAt(end);
					start_index = index;
					pos = document.positionAt(index);
					char = document.getText(new vscode.Range(pos, pos.translate(0, 1)));
					while (depth != 0) 
					{
						if(char === function_opening)
							depth++;
						else if(char === function_closing)
							depth--;

						// increment of index has to put before any oepration that will break the function
						index++;
						
						if(depth==0)
							break;
						
						pos = document.positionAt(index); // get the next position
						char = document.getText(new vscode.Range(pos, pos.translate(0, 1))); // get the next character
					}
					end_index = index;
					// update the end position again
					// match.index - the starting index that my regex matches it
					// index - match.index - the length of the function body
					end = document.positionAt(temp_match.index + (index-temp_match.index));
					// construct the range
					const range = new vscode.Range(start, end);
					

					/**********************************************************************
					finally, push to array
					***********************************************************************/


					// for javascript, they have anonymous function
					// if not match alphabets, set it to anonymous
					if(!function_name.match(/[a-z]/i))
					{
						function_name = 'anonymous'
					}
					
					// push to array, this will show the list of symbols later
					treeArr.push(new SymbolTreeItem(
						``+function_name, 
						vscode.TreeItemCollapsibleState.None, 
						range));
						
						
					// get the complete string that you want to remove from the buffered 'text'
					// to make way for next regex to search
					to_repalce = document.getText(range);
					// for removing text in the buffered 'text' later
					position_arr.push(to_repalce);
				}
			}
			else // for those that dont need '{}' depth handling
			{
				let regex_whole = value.whole[0];
				let flag_whole = value.whole[1];
				let match = null;
				let symbol_name = null;
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

					// handling for extracting symbol name given word appear 'before' the symbol
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
						symbol_name = sub.substring(start_index);
					}
					// handling for extracting symbol name given word appear 'after' the symbol
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

						// for 'after' case, you need to handle how to extract the symbol name
						
						// sub_sub may refer to substring of the substring
						// get the string from the start_index
						// cannot skip this, if you straight do sub.indexof(" ")
						// then it will detect the 1st white space
						// eg: #define A 1
						// there are 2 white spaces
						// what you want is extract "A" out, 1st white space ady handled from loop above
						// then this is to handle the 2nd white space
						let sub_sub = sub.substring(start_index);
						// only get until the next white space
						// have to add the start_index, because you're substring-ing the 'sub' varaible
						// and the sub_sub variable has the start_index cut off, from the code above 
						sub_sub = sub.substring(start_index, sub_sub.indexOf(" ") + start_index);
						symbol_name = sub_sub;
					}
					

					let temp_doc = editor.document;
					let temp_text = temp_doc.getText();
					let temp_match = null;
					// have to use another regex, 
					// if reuse the existing regex, it will continue the next pattern
					let temp_regex_whole = new RegExp(regex_whole, flag_whole);

					// to capture regex on the original document
					while( temp_match = temp_regex_whole.exec(temp_text) )
					{
						// if match with current matched pattern, 
						// means this pattern is not a duplicate
						if (temp_match[0] == match[0])
							break;
					}

					// fail safe check, 
					// if pattern not found on original document, dont proceed
					if (!temp_match)
					{
						continue;
					}



					const start = document.positionAt(temp_match.index);
					const end = document.positionAt(temp_match.index + temp_match[0].length);
					const range = new vscode.Range(start, end);

					to_repalce = document.getText(range);
					position_arr.push(to_repalce);

					// push to array, this will show the list of symbols later
					treeArr.push(new SymbolTreeItem(
						``+symbol_name, 
						vscode.TreeItemCollapsibleState.None, 
						range));
						
				}
			}
			// remove the content i dont need in text buffer
			// have to do it after the while loop
			// else, u will affect the iterator
			let prev_length = 0;
			for (let to_repalce of position_arr)
			{
				// after you removed the strings, the indexes needs to be recalculated
				// start_index -= prev_length;
				// end_index -= prev_length;
				// text = text.substring(0, start_index) + '' + text.substring(end_index);
				text = text.replace(to_repalce, '');
				// prev_length = end_index - start_index;
			}
		}

		// Return an array of tree items
		return Promise.resolve(treeArr);
	}

	// Implement the getTreeItem method
	getTreeItem(element: SymbolTreeItem): vscode.TreeItem {
		// Return the element as a tree item
		return element;
	}
}

// async function modifyRangeInDocument(start: vscode.Position, end: vscode.Position, newText: string) {


// 	let me2 = document.getText();
// 	let x2;
// }



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

function resetDecoration(decorationTypes: vscode.TextEditorDecorationType[])
{
	// Reset all decoration types to their default state
	for (const type of decorationTypes) {
		type.dispose();
	}
	// delete all the elements
	decorationTypes = [];
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