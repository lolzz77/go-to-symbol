import * as vscode from 'vscode';
import * as fs from 'fs';
import * as func from './function';
import { arrayBuffer } from 'stream/consumers';

/*
 problem
 1. if you happen to have pattern same name, like
 #define abc 1
 #define abc

 and your pattern is the 2nd one, which is '#define abc'
 then, your algorithm will keep highlighting the 1st encounter of '#define abc', which is the 1st one
*/


// global variable
// the size to hold number of active editors
var ARR_SIZE = 10;
// i made this global so i can dispose it in deactivate function
var treeView:vscode.TreeView<SymbolTreeItem>;

interface symbolTreeInterface {
	/*
	note:
	for interface,
	u have to make sure the name in here,
	tallied wit the name you gonna pass in
	*/

	// URI - the file path of the active editor
	filePath: string;
	// the list of symbols for the file
	symbolTreeItem: SymbolTreeItem[];
}

export function activate(context: vscode.ExtensionContext) {
	// the following code will run, once you press the sidebar logo
	// it will then construct the sidebar
	// once constructed, it will not construct anymore
	// meaning the following code will not run anymore
	// unless you trigger onDidChange... etc function
	// and the activate function that you activate thru clicking the command in command pallete

	let editor = vscode.window.activeTextEditor;
	if(!editor)
		return;

	// get all the symbols of the current active editor
	let symbolTreeItem:SymbolTreeItem[] = getSymbols(editor);
	// Create a tree data provider for the view
	// this variable, i believe is to create the sidebar, but not the list inside of it
	const treeDataProvider:TreeDataProvider = new TreeDataProvider(symbolTreeItem);
	// this variable, will be the list that will be shown on the sidebar.
	// for keeping track of decorations
	var decorationTypes: vscode.TextEditorDecorationType[] = [];

	// an array that can be used to dispose item inside when needed
	// to dispose it, call disposables.forEach(d => d.dispose());
	// var disposables:vscode.Disposable[] = [];

	// my extension array, to be placed into disposables array so dispose them
	// writing  goToSymbolArr:symbolTreeInterface[] = new Array(ARR_SIZE);
	// will cause the goToSymbolArr.findIndex() crashes
	// because if you do for(let x of goToSymbolArr))
	// the `x` is undefined
	// root cause, when you do goToSymbolArr.push()
	// it pushes into the last element of array
	// thus, when you do looping to search the array
	// the 1st index is null/undefined
	// solution: use .fill({filePath: "", symbolTreeItem: []})
	let goToSymbolArr:symbolTreeInterface[] = new Array(ARR_SIZE).fill({filePath: "", symbolTreeItem: []});
	
	const filePath:string = editor.document.uri.path;
	// you have to use `{}` when pushing into this array
	goToSymbolArr.push({filePath, symbolTreeItem});


	// by putting this code, no need to trigger 'activate', it will auto load
	vscode.window.registerTreeDataProvider(
		'my-view', // this one has to follow "view" section in package.json
		treeDataProvider
	);
	
	// by putting this code, i dk, put or not put the tree will be printed still
	// the only thing is, it assign to variable, and you use that variable for listening to clicked event
	treeView = vscode.window.createTreeView<SymbolTreeItem>(
		'my-view', 
		{
			treeDataProvider : treeDataProvider,
			showCollapseAll: true,
			canSelectMany: true,
			manageCheckboxStateManually: false,
		}
	);

	// Listen for selection
	treeView.onDidChangeSelection(event => {
		let settingPath = func.getJSONPath('setting');
		func.createAndWriteFile(settingPath, 'setting');
		let settingObj = func.getJSONData(settingPath);

		// get the selected object
		const selectedItems = event.selection as SymbolTreeItem[];
		// get the collapsiblestate, i dont want to trigger this if parent is selected
		const selectedItemCollapsibleState = selectedItems[0].collapsibleState;
		const selectedLabel = selectedItems[0].label;
		const backgroundDecorationType = vscode.window.createTextEditorDecorationType({
			// the last element is the opacity
			backgroundColor: settingObj.backgroundColor, // grey
			// this opacity appleis to the text instead of the background color
			// opacity: '0',
			// this can be seen on minimap, the small block colors
			overviewRulerColor: settingObj.overviewRulerColor, // green
			// to show the block color on the right
			overviewRulerLane: vscode.OverviewRulerLane.Full,
			// minimapColor: 'red' // this color will be used in the minimap
			});
		
		// you have to update the editor
		// else, it will keep using back the previous editor
		let editor = vscode.window.activeTextEditor;
		if(	editor == null ||
			selectedItems.length == 0)
		{
			return;
		}

		// means, this is parent tree, then, dont do any decoration, just exit
		// expending/collapsing these parent will be handled by vscode
		if (selectedItemCollapsibleState != vscode.TreeItemCollapsibleState.None)
		{
			return;
		}

		// each decoratino made needs to be keep tracked, so tha tyou can dispose it later	
		decorationTypes.push(backgroundDecorationType);
		
		if(selectedLabel == 'reset')
		{
			func.resetDecoration(decorationTypes);
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

	let disposable1 = vscode.commands.registerCommand('go-to-symbol.refresh', () => {
		// to reset the array
		func.resetDecoration(decorationTypes);
		// i think array = []; is not necessary
		goToSymbolArr.fill({filePath: "", symbolTreeItem: []});
	});


	let disposable2 = vscode.commands.registerCommand('go-to-symbol.showPath', () => {
		func.showFilePath();
	});

	// detect if you selected other editors (eg: different files)
	vscode.window.onDidChangeActiveTextEditor(editor => {
		// cleanup
		func.resetDecoration(decorationTypes);

		// if you debug
		// it will come here twice (i dk why)
		// the 1st time this editor will be null
		// the 2nd time will have value
		if(!editor)
			return;

		const filePath:string = editor.document.uri.path;
		// check if the current editor exists in the array
		// return value: index value if found, -1 if not fund
		let existsIndex = goToSymbolArr.findIndex(element => element.filePath === filePath);


		// if exists, then we reuse the data
		if(existsIndex >= 0)
		{
			// this will refresh the tree list
			treeDataProvider.refresh(goToSymbolArr[existsIndex].symbolTreeItem);
			return;
		}


		// else, create it
		let symbolTreeItem:SymbolTreeItem[] = getSymbols(editor);
		// add to array
		// actually, since you use array.fill() above
		// this if is 100% will run,
		// which means, this checking serves no purpose
		// just do array.shift() can ady
		// but just leave it here
		if(goToSymbolArr.length >= ARR_SIZE)
		{
			// this will remove the 1st element of array
			goToSymbolArr.shift();
		}
		// this pushes will push to the last element of array
		goToSymbolArr.push({filePath, symbolTreeItem});
		treeDataProvider.refresh(symbolTreeItem);

	});
	
	// register command into command pallete
	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

// this function will be triggered when you disable your extension
export function deactivate() {
	/* no need to dispose
	1. array
	2. const treeDataProvider:TreeDataProvider = new TreeDataProvider(symbolTreeItem);, provided you DIDNT use registerTreeDataProvider()
	if you use registerTreeDataProvider, then vscode will dispose it for u
	*/

	treeView.dispose();
}

// Define a class for the tree data provider
class TreeDataProvider implements vscode.TreeDataProvider<SymbolTreeItem> {

	// the data to hold the whole symbol trees
	// eg:
	// function
	// - main()
	// - read_line()
	// macro
	// - UPRINTF
	// - AB_UPGRADE
	private data: SymbolTreeItem[]|undefined;

	constructor(data:any) {
		this.data = data;
	}
	
	// A private event emitter that fires the onDidChangeTreeData event
	private _onDidChangeTreeData: vscode.EventEmitter<SymbolTreeItem | undefined | null | void> = new vscode.EventEmitter<SymbolTreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<SymbolTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	// required, read the document
	// the `element` will only be triggered when you expand the collapsed tree
	getChildren(element?: SymbolTreeItem): vscode.ProviderResult<SymbolTreeItem[]> {
		// element will be undefined for tree that doesn't collapse, that is, vscode.TreeItemCollapsibleState.None
		if(element == undefined)
		{
			// which means, no children, thus, just return the object's data
			return this.data;
		}
		// else, return the children
		return element.children;
	}

	// required, read the document
	getTreeItem(element: SymbolTreeItem): vscode.TreeItem {
		// Return the element as a tree item
		return element;
	}

	// A refresh method that updates the tree view data and fires the event
	refresh(data?: SymbolTreeItem[]): void {
		// Update the data source for the tree view
		this.data = data;
		// Fire the event to notify VS Code that the tree view has changed
		this._onDidChangeTreeData.fire();
	}

}

// this class holds the detail of list of symbols that regex matches
// one symbol for 1 class
class SymbolTreeItem extends vscode.TreeItem {
	// to hold the subtree items.
	// a tree can be expended further, revealing more trees
	// these sub-trees are 'children'
	children: SymbolTreeItem[]|undefined;

	constructor(
		// this is the string that appear on the tree list
		public readonly label: string,
		// whether they collapse or not, hold `CTRL`, hover over TreeItemCollapsibleState to see more
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly range?: vscode.Range|null,
		children?: SymbolTreeItem[],
		// public readonly id?: string,
		// public readonly command?: vscode.Command,
		// public readonly iconPath: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;
	) {
		super(label, collapsibleState);
		this.children = children;
	}
}


// the main function to get the symbols
function getSymbols(editor:vscode.TextEditor):SymbolTreeItem[] {
	// this is the regex JSON data
	var entries = func.getRegexData();
	// the parent tree. This will be 'function',
	// then inside 'function', has a lot of matched function patterns
	var treeArr:SymbolTreeItem[] = [];
	// the children. This will be the matched function patterns
	// for the parent tree
	var childTreeArr:SymbolTreeItem[] = [];

	if(!entries)
		return [new SymbolTreeItem('regex is null', vscode.TreeItemCollapsibleState.None)];

	// button to reset decoration
	treeArr.push(new SymbolTreeItem('reset', vscode.TreeItemCollapsibleState.None));

	const document = editor.document;
	var text = document.getText();
	for (const [key, value] of entries) {
		childTreeArr = [];

		let symbolType = key;
		let operation = value.operation;

		let start_index = 0;
		let end_index = 0;
		let to_replace = '';

		let regex_whole = value.whole[0];
		let flag_whole = value.whole[1];
		let keys = Object.keys(value);
		let keyword_to_search_for_symbol = null;
		let function_opening = value.opening[0];
		let function_closing = value.opening[1];

		let symbol_name = '';
		let range = null;
		let match = null;
		let _regex_whole = new RegExp(regex_whole, flag_whole);
		
		// fail safe check, if no regex, skip
		if(regex_whole == '')
			continue;

		// some need to search the symbol BEFORE the char
		// some need to search the symbol AFTER the char
		if(keys.includes("before"))
			keyword_to_search_for_symbol = value.before;
		else
			keyword_to_search_for_symbol = value.after;

		while(match = _regex_whole.exec(text)) {
			start_index = 0;
			end_index = 0;
			symbol_name = '';
			range = null;
			// for checking whether the current index has found the 1st character or not
			let hasFountFirstChar = false;
			let str = match.toString();
			let sub = '';
			let index = 0;
			let closest_index = 0;
			let char = '';

			let original_doc_text = '';
			let original_doc_start = 0;
			let original_doc_end = 0;
			let start = null; // rename to smethg better, this is for start = document.positionAt(original_doc_start)
			let end = null;

			if (operation == 'remove')
			{
				/**********************************************************************
				 to get whole pattern start & end index
				***********************************************************************/
				start_index = match.index;
				end_index = match.index + match[0].length;
				to_replace = text.substring(start_index, end_index)
				
				/**********************************************************************
				 to remove the pattern from the buffered text
				***********************************************************************/
				text = text.replace(to_replace, '');
				_regex_whole.lastIndex = 0;

				// that's it for 'remove' operation, no need add into array
				continue;
			}
			
			/**********************************************************************
			 * below is handling for operation that has 'depth' and no depth
			 * some of them has similarity and thus i pull them out
			 * eg: they both has this 'extract symbol name' operation
			 * so i pull that out
			 * then, the following handling will be different
			 * thus will be separated by 'if operation == depth' and 'else'
			 **********************************************************************/


			/**********************************************************************
			 to extract the symbol name
			***********************************************************************/
			// actually, the `match` is an array, match[1] holds the function name
			// however, this algorithm applies got struct, enum those as well
			// thus, tho you can do symbol_name = match[1]
			// is better do manually, so that it applies to all cases

			for(let keyword of keyword_to_search_for_symbol)
			{
				// save the 1st index first, else, later math.min, it will always 0
				// if indexOf cannot find the symbol, it will return -1
				// thus, check <=0 is better
				if(closest_index <= 0)
					closest_index = str.indexOf(keyword);
				else if(keys.includes("before"))
					closest_index = Math.min(closest_index, str.indexOf(keyword));
				else
					closest_index = Math.max(closest_index, str.indexOf(keyword));
			}

			// given keyword, get substring
			if(keys.includes("before"))
				sub = str.substring(0, closest_index);
			else
				sub = str.substring(closest_index);

			if( operation == 'depth')
			{
				/**********************************************************************
				 still trying to extract the function name
				***********************************************************************/

				index = sub.length - 1; // point to the last character
				// Loop through the string backwards
				while (index >= 0) 
				{
					let char = sub.charAt(index); // Get the character at the current index
					if (char == " " && hasFountFirstChar) 
					{ 	// Check if the character is a white space
						break;
					}
					/*
					* because there are some cases like this
					* int main (...)
					* there's white space before the `(`
					*/
					else if (!isNaN(Number(char)) && char != " ") // isNaN = is not a number
					{
						hasFountFirstChar = true;
					}
					else if ((char.match(/[a-z]/i)) && char != " ") // if is alphabet
					{
						hasFountFirstChar = true;
					}
					index--;
				}
				// + 1, because the current index is pointing to white spaces
				// get the substring, starting from the given start index
				symbol_name = sub.substring(index + 1);
				// remove white spaces
				symbol_name = symbol_name.replace('\\s*', '');
				// remove '\n' characters
				symbol_name = symbol_name.replace('\n', '');
				


				/**********************************************************************
				find the whole function body, using depth method
				***********************************************************************/


				// First, make sure the regex that matches the pattern,
				// matches the whole thing properly, like, at the start of the string
				

				/**********************************************************************
				search the function backwards
				***********************************************************************/

				index = match.index;
				char = text.charAt(index);

				// match.index == 0 refers that this is the beginning of the document,
				// you can go backwards anymore, this is the 1st index of document
				// i wanted it to stop when match new line '\n', but apparently, it just ''
				// above is for if you do document.getText(new vscode.Range(pos, pos.translate(0, 1))); 
				// but if you use text.charAt(), then it is "\n"
				while(index != 0 && char != "\n")
				{
					index--;
					char = text.charAt(index);
				}
				index++;
				// save the start index
				start_index = index;


				/**********************************************************************
				now, search the rest of the function forward
				***********************************************************************/


				// my regex only match until the 1st opening, thus, set depth starting at 1
				// i cannot do regex that matches whole function body
				// the best i can do is match til the 1st encounter of '}'
				let depth = 1;
				// these ranges are used for highlighting the background
				index = match.index + match[0].length;
				char = text.charAt(index);
				while (depth != 0 && index <= text.length) 
				{
					if(char === function_opening)
						depth++;
					else if(char === function_closing)
						depth--;
					
					// increment of index has to put before any oepration that will break the function
					index++;
					
					if(depth==0)
						break;
				
					char = text.charAt(index);
				}
				
				
				// match until the newline, or until end of document
				char = text.charAt(index);
				while(char != "\n" && index <= text.length)
				{
					index++;
					char = text.charAt(index);
				}
				end_index = index;
				to_replace = text.substring(start_index, end_index)


				/**********************************************************************
				then, check whether to push to array or not
				***********************************************************************/

				// above has handling for duplicate regex
				// however, that only detects what the regex matches
				// you had another loop to handle to match whole pattern (eg whole function)
				// thus, this to ensure the whole pattern is present in the current text buffer
				// else, it means this pattern has been removed from the buffer
				// and shall not reset the _regex_whole.lastIndex to 0
				if(!text.includes(to_replace))
					continue;


				/**********************************************************************
				Given the pattern, get the original document position
				***********************************************************************/
				// because currently your 'text' has been modified
				// where, you erased those that matched pattern,
				// to make way for next regex to detect pattern
				// to not make the regex detect duplicate pattern

				original_doc_text = document.getText();
				original_doc_start = original_doc_text.indexOf(to_replace);
				original_doc_end = original_doc_start + to_replace.length;
				start = document.positionAt(original_doc_start);
				end = document.positionAt(original_doc_end);
				range = new vscode.Range(start, end);

				/**********************************************************************
				remove the text from buffered text
				***********************************************************************/


				// remove the content that matched in the text buffer
				// to make way for next regex
				text = text.replace(to_replace, '');
				// you have to reset its lastIndex,
				// else, the next regex wont able to find the next pattern cos the 'text'
				// buffer has been modified
				_regex_whole.lastIndex = 0;


				/**********************************************************************
				finally, push to array
				***********************************************************************/


				// for javascript, they have anonymous function
				// if not match alphabets, set it to anonymous

				// or, if the name is same as symbol type, also set it to anonymous
				if(!symbol_name.match(/[a-z]/i) || symbol_name == symbolType)
				{
					symbol_name = 'anonymous'
				}

				childTreeArr.push(new SymbolTreeItem(
					symbol_name, 
					vscode.TreeItemCollapsibleState.None, 
					range));
			}

			else
			{
				/**********************************************************************
				 still trying to extract the function name
				***********************************************************************/

				// handling for extracting symbol name given word appear 'before' the symbol
				if(keys.includes("before"))
				{
					index = sub.length - 1; // point to the last character
					// Loop through the string backwards
					while (index >= 0) 
					{
						let char = sub.charAt(index); // Get the character at the current index
						if (char == " " && hasFountFirstChar)
						{ 	// Check if the character is a white space

							// there are cases where ppl put more than 1 whitespaces
							while(char == " ")
							{
								index--;
								char = sub.charAt(index);
							}
							index++; // current char is prev char of the whitespace, move back forward 1 character
							break;
						}
						else if(char == "\n")
						{
							break;
						}
						else if (!isNaN(Number(char)) && char != " ") // isNaN = is not a number
						{
							hasFountFirstChar = true;
						}
						else if ((char.match(/[a-z]/i)) && char != " ") // if is alphabet
						{
							hasFountFirstChar = true;
						}
						index--;
					}
					// save the start index
					start_index = index;

					// get the substring, starting from the given start index
					symbol_name = sub.substring(start_index);
				}
				// handling for extracting symbol name given word appear 'after' the symbol
				else
				{
					index = 0; // point to the first character
					// Loop through the string forward
					while (index < sub.length) 
					{
						let char = sub.charAt(index); // Get the character at the current index
						if (char == " " && hasFountFirstChar)  
						{ 	// Check if the character is a white space

							// there are cases where ppl put more than 1 whitespaces
							while(char == " ")
							{
								index++;
								char = sub.charAt(index);
							}
							// not needed, above loop made sure the current char is not whitespace
							// i++; // current char is whitespace, move to the character
							break;
						}
						else if(char == "\n")
						{
							break;
						}
						else if (!isNaN(Number(char)) && char != " ") // isNaN = is not a number
						{
							hasFountFirstChar = true;
						}
						else if ((char.match(/[a-z]/i)) && char != " ") // if is alphabet
						{
							hasFountFirstChar = true;
						}
						index++;
					}
					// save the start index
					start_index = index;

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


					// this is to handle cases that, they dont have whitespace as the end
					// instead, is a newline at the end
					let end_substring = sub_sub.indexOf(" ");
					if (end_substring < 0)
						end_substring = sub_sub.indexOf("\n");
					
					
					// only get until the next white space
					// have to add the start_index, because you're substring-ing the 'sub' varaible
					// and the sub_sub variable has the start_index cut off, from the code above 
					sub_sub = sub.substring(start_index, end_substring + start_index);
					symbol_name = sub_sub;
				}

				/**********************************************************************
				to get the whole pattern
				***********************************************************************/
				// 1. loop backwards
				// 2. loop forwards

				/**********************************************************************
				loop backwards
				***********************************************************************/
				// match until newline, or start of document
				index = match.index;
				char = text.charAt(index);
				while(index != 0 && char != "\n")
				{
					index--;
					char = text.charAt(index);
				}
				// current char is newline, move to the next char
				index++;
				// save start_index
				start_index = index;

				/**********************************************************************
				loop forwards
				***********************************************************************/
				// match until the newline, or until end of document
				// if detected '\\n, newline that is preceded with another '\', then dont stop,
				// continue, until match '\n' that has no '\' precede
				// -1, cos the current index is pointing to the next char of what my regex has matched.
				// That is, my regex macthed til \n, but the index will point to the next char of the \n
				index = match.index + match[0].length -1;
				char = text.charAt(index);

				// this ugly nested is to handle "\\n" detection
				// kekeke
				// basically, if detects "\\n", means not real newline
				// only when detect "\n", is real newline
				let prev_char = text.charAt(index - 1); // previous char of the current index
				if(prev_char == "\\")
				{
					index ++;
					char = text.charAt(index);
					prev_char = text.charAt(index - 1);
					while(char != "\n" && index <= text.length)
					{
						index++;
						char = text.charAt(index);
						prev_char = text.charAt(index - 1);
						if(char == "\n")
						{
							if(prev_char == "\\")
							{
								index++;
								char = text.charAt(index);
							}
						}

					}
				}
				// save end_index
				end_index = index;
				// get the whole pattern
				// i guess substring 2nd argument is not included?.. like python slice()
				// i dk...
				to_replace = text.substring(start_index, end_index + 1)

				/**********************************************************************
				then, check whether to push to array or not
				***********************************************************************/
				if(!text.includes(to_replace))
					continue;

				/**********************************************************************
				Given the pattern, get the original document position
				***********************************************************************/
				original_doc_text = document.getText();
				original_doc_start = original_doc_text.indexOf(to_replace);
				original_doc_end = original_doc_start + to_replace.length;
				start = document.positionAt(original_doc_start);
				end = document.positionAt(original_doc_end);
				range = new vscode.Range(start, end);


				/**********************************************************************
				remove the text from buffered text
				***********************************************************************/
				text = text.replace(to_replace, '');
				_regex_whole.lastIndex = 0;

				childTreeArr.push(new SymbolTreeItem(
					symbol_name, 
					vscode.TreeItemCollapsibleState.None, 
					range));
			}
		}

		if(childTreeArr.length == 0)
			childTreeArr.push(new SymbolTreeItem(
				'null', 
				vscode.TreeItemCollapsibleState.None));

		/**********************************************************************
		finally, push to array
		***********************************************************************/
		// dont print out 'comment' tree list
		// the intention for 'comment' regex is to remove comments only
		if (operation != 'remove')
		{
			// push to array, this will show the list of symbols later
			treeArr.push(new SymbolTreeItem(
				symbolType, 
				vscode.TreeItemCollapsibleState.Expanded, 
				range,
				childTreeArr));
		}

	}
	return treeArr;
}