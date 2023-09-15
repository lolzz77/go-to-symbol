import * as vscode from 'vscode';
import * as func from './function';
/*
 problem
 1. for global variable
 some can omit the `;` symbol
 eg: int test = {
	int x;
 }
 not sure about struct n enum

 2. new feature - add line number
 
 3. for "ignorecommentedcode", it will run the regex for the `whole` document first
 only then it able to run the next regex
 So, if `#define` is in function
 it will extract the `#define` in function first, then only extract function
 thus causing problem
*/

// i made this global so i can dispose it in deactivate function
var treeView:vscode.TreeView<SymbolTreeItem>;
var goToSymbolArr:symbolTreeInterface[] = [];

interface symbolTreeInterface {
	/*
	note:
	may be used by multiple array
	i put multiple examples comments in each of the member
	*/

	// URI - the file path of the active editor
	// the parent. Eg: 'function'
	parent: string;
	// the list of symbols for the file
	// their chidlren. Eg: 'main()', 'read_line()'
	children: SymbolTreeItem[];
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

	// create the setting.json file
	let settingPath = func.getJSONPath('setting');
	func.createAndWriteFile(settingPath, 'setting');

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
	// Update: not needed, JS array are dynamic, just do array.length to check for array size
	// previosuly i tot i need fill, but not, just neeed to intiialize it to empty array, eg: array = [];
	// goToSymbolArr = new Array(ARR_SIZE).fill({parent: "", children: []});
	const filePath:string = editor.document.uri.path;
	// you have to use `{}` when pushing into this array
	goToSymbolArr.push({parent:filePath, children:symbolTreeItem});


	// by putting this code, no need to trigger 'activate', it will auto load
	vscode.window.registerTreeDataProvider(
		'goToSymbolView', // this one has to follow "view" section in package.json
		treeDataProvider
	);
	
	// by putting this code, i dk, put or not put the tree will be printed still
	// the only thing is, it assign to variable, and you use that variable for listening to clicked event
	treeView = vscode.window.createTreeView<SymbolTreeItem>(
		'goToSymbolView', 
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

	// to reset everything
	// the tree, and the JSON file
	let disposable1 = vscode.commands.registerCommand('go-to-symbol.reset', () => {
		// to reset the array
		func.resetDecoration(decorationTypes);
		// dispose all items
		disposeArray(goToSymbolArr);

		// re-assign the size
		// cos, now the size is 0
		// and you do goToSymbolArr.fill(), it fills nothing
		// However, do not that JS uses dynamic array
		// tho you didnt specify the array size, it will works whenever you do arr.push()
		// and i think this is not needed
		// i dk if like run this in a loop what will happen,
		// goToSymbolArr = new Array(ARR_SIZE);
		
		// this one is also not needed, since now array is at size 0, filling doesn't cause anything
		// goToSymbolArr.fill({parent: "", children: []});
		
		// just show any index of array item
		treeDataProvider.refresh([]);
		// delete the JSON files as well
		let path = vscode.env.appRoot + '/go-to-symbol/';
		func.clearDirectory(path);
	});

	// to refresh tree only, only the current active editor's tree
	let disposable3 = vscode.commands.registerCommand('go-to-symbol.refreshTree', () => {
		// re-create again, incase the setting file is deleted
		let settingPath = func.getJSONPath('setting');
		func.createAndWriteFile(settingPath, 'setting');
		let settingObj = func.getJSONData(settingPath);
		let ARR_SIZE = settingObj.arraySize;

		// show empty list first
		treeDataProvider.refresh([]);

		// now re-get the symbols
		let editor = vscode.window.activeTextEditor;
		if(!editor)
			return;
		let symbolTreeItem:SymbolTreeItem[] = getSymbols(editor);
		const filePath:string = editor.document.uri.path;
		let existsIndex = goToSymbolArr.findIndex(element => element.parent === filePath);
		// if exists, re-update the array
		if(existsIndex >= 0)
		{
			for(let child of goToSymbolArr[existsIndex].children)
				child.dispose();
			// discard / de-reference all the array elements
			// to allow JS to garbage collect it
			goToSymbolArr[existsIndex].children = [];
			// now push the new symbols to it
			goToSymbolArr[existsIndex].children = symbolTreeItem;
			// refresh the tree
			treeDataProvider.refresh(goToSymbolArr[existsIndex].children);
			return;
		}
		// if not exists, push to array
		// this happens when you run `reset` command to delete everything
		// then straight run `refresh tree` command to update the tree
		// however, still put arr size check for fail-safe scenario
		while(goToSymbolArr.length > ARR_SIZE)
		{
			// dispose 1st element in a loop
			for (const child of goToSymbolArr[0].children)
				child.dispose();
			// this will remove the 1st element of array
			goToSymbolArr.shift();
		}
		goToSymbolArr.push({parent:filePath, children:symbolTreeItem});
		treeDataProvider.refresh(symbolTreeItem);
	});


	let disposable2 = vscode.commands.registerCommand('go-to-symbol.showPath', () => {
		func.showFilePath();
	});

	// detect if you selected other editors (eg: different files)
	vscode.window.onDidChangeActiveTextEditor(editor => {
		// cleanup
		func.resetDecoration(decorationTypes);

		// re-create again, incase the setting file is deleted
		let settingPath = func.getJSONPath('setting');
		func.createAndWriteFile(settingPath, 'setting');
		let settingObj = func.getJSONData(settingPath);
		let ARR_SIZE = settingObj.arraySize;

		// if you debug
		// it will come here twice (i dk why)
		// the 1st time this editor will be null
		// the 2nd time will have value
		if(!editor)
			return;

		// use `>` rather than `>=`
		// i used arr = new Array(4) 
		// then, arr.fill()
		// the result will be arr.length = 5
		// it has 0th index ~ 4th index array
		// then, after this loop, will push new array
		// thus, the arr.length will be 5
		// i follow how arr = new Array(4) behave
		// no need to handle if arr.length < ARR_SIZE, just keep pushing new element
		// JS uses dynamic array
		while(goToSymbolArr.length > ARR_SIZE)
		{
			// dispose them first
			// only dispose the children of 1st element
			for (const child of goToSymbolArr[0].children)
				child.dispose();
			// this will remove the 1st element of array
			goToSymbolArr.shift();
		}

		const filePath:string = editor.document.uri.path;
		// check if the current editor exists in the array
		// return value: index value if found, -1 if not found
		let existsIndex = goToSymbolArr.findIndex(element => element.parent === filePath);

		// if exists, then we reuse the data
		if(existsIndex >= 0)
		{
			// this will refresh the tree list
			treeDataProvider.refresh(goToSymbolArr[existsIndex].children);
			return;
		}

		// else, create it
		let symbolTreeItem:SymbolTreeItem[] = getSymbols(editor);


		// this pushes will push to the last element of array
		goToSymbolArr.push({parent:filePath, children:symbolTreeItem});
		treeDataProvider.refresh(symbolTreeItem);

	});
	
	// register command into command pallete
	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
}

// this function will be triggered when you disable your extension
export function deactivate() {
	/* no need to dispose
	1. array
	2. const treeDataProvider:TreeDataProvider = new TreeDataProvider(symbolTreeItem);, provided you DIDNT use registerTreeDataProvider()
	if you use registerTreeDataProvider, then vscode will dispose it for u
	*/
	disposeArray(goToSymbolArr);
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

/*
TODO: U WANNA CHECK HOW TO DISPOSE THIS CLASS OBJECT PROPERLY
*/

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

	// TODO: attempting to dispose object properly
	// my `children` will be undefined when running this code
	/*
			listOfSymbolsArr.push({
			parent:key, 
			children:[new SymbolTreeItem(
				'null',
				vscode.TreeItemCollapsibleState.None)
			]
		});
	*/
	// because, i didn't pass in any children
	// thus, i should dispose `super` instead, cos this is what constructed in constructor
	// however, TreeItem doesn't have `dispose` method
	// so.. how to dispose this TreeItem?..
	// it is told that, just dispose your class member resources
	dispose() {
		// super.dispose();
		if (this.children) {
			for (const child of this.children) {
				child.dispose();
			}
			this.children = [];
		}
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
	var listOfSymbolsArr:symbolTreeInterface[] = [];
	
	if(!entries)
		return [new SymbolTreeItem('regex is null', vscode.TreeItemCollapsibleState.None)];

	// button to reset decoration
	treeArr.push(new SymbolTreeItem('reset', vscode.TreeItemCollapsibleState.None));

	// push it to array first
	// this is to ensure it will display according to the order you defined in language.JSON file
	// eg: display functions first, global at last
	for (const [key, value] of entries) {
		let regexesArray = value.regexes;
		let proceedToAdd = false;
		for(const regexEntries of regexesArray)
		{
			let operation = regexEntries.operation;
			// these regexes are mean for removing from text buffer only, dont add them into list of symbols
			// warning: current JSOn design, a parent has many children. Each child has individual operation
			// what will happen if child 1 has `remove`, child 2 doesnt have?
			// for now, the logic is, as long as all children no `remove`, add the parent
			// if 1 has `remove` but the other doesnt have, proceed to add the parent
			if(operation != 'remove')
			{
				// no need to check for others, as long as can add, 
				// just proceed to add regardless whether the next one is `remove` or not
				proceedToAdd = true;
				break;
			}
		}
		if(proceedToAdd == false)
			continue;
		listOfSymbolsArr.push({
			parent:key, 
			children:[new SymbolTreeItem(
				'null',
				vscode.TreeItemCollapsibleState.None)
			]
		});
	}

	const document = editor.document;
	var text = document.getText();

	// next, push all the regexes to an array
	// so that, if the current active document doesnt have that regex,
	// we dont need to waste resources to keep check it
	// eg: a header file, doesn't have function body defined, 
	// thus, can remove this regex from array
	let copyOfEntries = JSON.parse(JSON.stringify(entries)) as typeof entries;
	// this way, it shows the current index, and the value of the array
	for(const [parentIndex,[key, value]] of copyOfEntries.entries())
	{
		let regexesArray = value.regexes;
		for(const [index, regexEntries] of regexesArray.entries())
		{
			let regexStr = regexEntries.regex[0];
			let flag = regexEntries.regex[1];
			let regex = new RegExp(regexStr, flag);
			let hasMatch = regex.test(text);
			if(hasMatch)
				continue;
			// remove the index-th element, remove 1 array size
			entries[parentIndex][1].regexes.splice(index, 1);
			// reset the index, else, it will continue to match pattern from last matched index
			// doing `let regex` will reset the lastIndex, however, i just leave it here, just in case
			regex.lastIndex = 0;
		}
		// if the parent's children is 0, remove the parent
		if(entries[parentIndex][1].regexes.length != 0)
			continue;
		delete entries[parentIndex];
		entries[parentIndex] = null;
	}

	// this code snippet is to remove `null` element in the json object
	let length = 0; // to keep track array size, to break out of loop
	let lastIndex = 0; // without this, it will always remove 1st element of array
	// cannot use for loop, after removing array, it will disturb the for iteration
	while(length < entries.length)
	{
		if(entries[length]!=null)
		{
			length++;
			lastIndex = length;
			continue;
		}
		// shift() always remove 1st array. This remove start from lastIndex-th index, remove 1 array
		// splice will ensure that, the following array index will shift
		// eg: array has 3 indexes
		// if remove 2nd index
		// the 3rd index will shift to 2nd index
		entries.splice(lastIndex, 1);
		length=lastIndex;
	}

	// free buffer
	copyOfEntries = null;

	let original_doc_last_index_offset = 0;
	while(text.length > 0)
	{
		let loopHasRemovedSometing = false;
		// remove starting newlines
		while(text.startsWith('\n'))
		{
			let prev_length = text.length;
			text = text.substring(1);
			let cur_length = prev_length - text.length;
			original_doc_last_index_offset += cur_length;
		}

		for (const [key, value] of entries) {
			let regexesArray = value.regexes;
			for(const regexEntries of regexesArray)
			{
				let ignoreCommentedCode = regexEntries.ignoreCommentedCode;
				let regexStr = regexEntries.regex[0];
				let flag = regexEntries.regex[1];
				let regex = new RegExp(regexStr, flag);
				// fail safe check, if no regex, skip
				if(regexStr == '')
					continue;
				let match = regex.exec(text);
				let symbolType:string = key;
				if(!match)
					continue;
				if(match.index!=0 && ignoreCommentedCode==false)
					continue;
	
				let operation = regexEntries.operation;
				let start_index = 0;
				let end_index = 0;
				let to_replace = '';
				let keys = Object.keys(regexEntries);
				let keyword_to_search_for_symbol = null;
				let function_opening = regexEntries.opening[0];
				let function_closing = regexEntries.opening[1];
				let symbol_name = '';
				let range = null;
				
				// some need to search the symbol BEFORE the char
				// some need to search the symbol AFTER the char
				if(keys.includes("before"))
					keyword_to_search_for_symbol = regexEntries.before;
				else
					keyword_to_search_for_symbol = regexEntries.after;
	
				// for checking whether the current index has found the 1st character or not
				let hasFountFirstChar = false;
				let str = match[0].toString();
				let sub = '';
				let index = 0;
				let closest_index = 0;
				let char = '';
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
					original_doc_last_index_offset += to_replace.length;
					
					/**********************************************************************
					 to remove the pattern from the buffered text
					***********************************************************************/
					text = text.replace(to_replace, '');
					regex.lastIndex = 0;
					loopHasRemovedSometing = true;
					// that's it for 'remove' operation, no need add into array
					break;
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
					while(symbol_name.includes(' '))
						symbol_name = symbol_name.replace(' ', '');
					// remove '\n' characters
					while(symbol_name.includes('\n'))
						symbol_name = symbol_name.replace('\n', '');
					// remove '*' characters
					while(symbol_name.includes('*'))
						symbol_name = symbol_name.replace('*', '');
					
	
	
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
					// foudn that this will cause it point to not valid char
					// that is, after newline, it will point to next char again
					// index++;
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
					original_doc_last_index_offset += to_replace.length;
	
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
	
					original_doc_start = original_doc_last_index_offset - to_replace.length;
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
	
					/**********************************************************************
					setup symbol name
					***********************************************************************/
					// for javascript, they have anonymous function
					// if not match alphabets, set it to anonymous
	
					// or, if the name is same as symbol type, also set it to anonymous
					if(!symbol_name.match(/[a-z]/i) || symbol_name == symbolType)
					{
						symbol_name = 'anonymous'
					}
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
					// remove white spaces
					while(symbol_name.includes(' '))
						symbol_name = symbol_name.replace(' ', '');
					// remove '\n' characters
					while(symbol_name.includes('\n'))
						symbol_name = symbol_name.replace('\n', '');
					// remove '*' characters
					while(symbol_name.includes('*'))
						symbol_name = symbol_name.replace('*', '');
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
					// update: if match.index is 0, means the pattern matched at the start of text
					// thus, after this loop gonna have index increment, making it not pointing to valid whole pattern
					// thus, add 1 more checking, match.index != 0
					if(index==0)
						index
					else
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
	
					// Purpose: to match til newline or end of document
					// Cases: after `;` symbol. It has white spaces behind
					// for global vairable handling, global variable can be tricky
					// my regex matches until `;`, and i dont wanna match it til newline
					// what if it's the last line of document and it doesn't have newlines after that
					// thus, the best is, use code to handle to match til newline or end of document
					while(char!="\n" && index<=text.length)
					{
						index++;
						char=text.charAt(index);
					}

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
					original_doc_last_index_offset += to_replace.length;
	
					/**********************************************************************
					then, check whether to push to array or not
					***********************************************************************/
					if(!text.includes(to_replace))
						continue;
	
					/**********************************************************************
					Given the pattern, get the original document position
					***********************************************************************/
					original_doc_start = original_doc_last_index_offset - to_replace.length;
					original_doc_end = original_doc_start + to_replace.length;
					start = document.positionAt(original_doc_start);
					end = document.positionAt(original_doc_end);
					range = new vscode.Range(start, end);
	
	
					/**********************************************************************
					remove the text from buffered text
					***********************************************************************/
					text = text.replace(to_replace, '');
				}
	
	
				/**********************************************************************
				finally, push to array
				***********************************************************************/
	
				/**********************************************************************
				this code checks whether parent exists in array or not, 
				then push to array accordingly
				however, the checking is not necessary anymore
				cos i have made sure that, i will initialize array to have parent, with null children
				just leave it here in case i need to refer it back
				***********************************************************************/
				// // Find the index of the object with parent == symbolType
				// let parentSymbolIndex = listOfSymbolsArr.findIndex((obj) => obj.parent === symbolType);
				// // means parent found
				// if (parentSymbolIndex !== -1) {
				// 	// Push new children to the object at the index
				// 	listOfSymbolsArr[parentSymbolIndex].children.push(new SymbolTreeItem(
				// 		symbol_name, 
				// 		vscode.TreeItemCollapsibleState.None, 
				// 		range));
				// }
				// else // push new parent to array
				// {
				// 	listOfSymbolsArr.push({parent:symbolType, children:[new SymbolTreeItem(
				// 		symbol_name, 
				// 		vscode.TreeItemCollapsibleState.None, 
				// 		range)]});
				// }
	
	
				// Find the index of the object with parent == symbolType
				let parentSymbolIndex = listOfSymbolsArr.findIndex((obj) => obj.parent === symbolType);
				// this is to remove 'null' children from array
				// because i intialized the array to have 'null' children
				if(listOfSymbolsArr[parentSymbolIndex].children[0].label == 'null')
				{
					listOfSymbolsArr[parentSymbolIndex].children[0].dispose();
					listOfSymbolsArr[parentSymbolIndex].children = [];
				}
				// Push new children to the object at the index
				listOfSymbolsArr[parentSymbolIndex].children.push(new SymbolTreeItem(
					symbol_name, 
					vscode.TreeItemCollapsibleState.None, 
					range));
	
				loopHasRemovedSometing = true;
				// break from loop
				// this is to make sure the regex starts all over again
				// eg: i want it to scan function regex first, before scanning for function prototype regex
				break;

			}
		}

		if(loopHasRemovedSometing == true)
			continue;
		// this is to handle if regex didn't remove any text
		// then, it means the text is start with something that no regex matches
		// or got regex matches, but is not at start of the text (my algorithm works the way it should matches text start at beginning of text)
		// and i have to remove it
		// else, will stuck in loop endlessly
		// remove the line until the next encoutner of newline
		let newlineIndex = text.indexOf('\n');
		let to_replace = text.substring(0, newlineIndex);
		original_doc_last_index_offset += to_replace.length;
		console.log('REMOVE : ' + to_replace);
		// cannot do like text = text.replace(to_replace, '');
		// because to_replace will be `''`, and, in the text buffer, it is `\n`
		// have to put newlineIndex + 1, else, it will always be 0 and always start at beginning of text
		// udpate: i think above assumption is not valid anymore,
		// above the loop i ady handled text.startWith("\n")
		text = text.substring(newlineIndex);
		
	}
	for(let array of listOfSymbolsArr)
	{
		treeArr.push(new SymbolTreeItem(array.parent, vscode.TreeItemCollapsibleState.Expanded, null, array.children));
	}
	return treeArr;
}

// to dispose class object that stored in array
/* 
	Note 1:
	after running this function
	// the child of child of the array is diposed
	// the parent array - goToSymbolArr's children are not disposed
	// i dk if is right
	// they should be diposed as well
	// i rmb i learn that you should only dispose class's member
	// so it should be correct, cos i seee in debugger, the children of the class object is disposed

	Note 2:
	// it is noted that arr = [], will modify the reference instead of the actual array
	// if you do arr.length = 0, then this is modifying the actual array
	// javasript is weird
	// try verify again with chatgpt
*/
function disposeArray(arr: symbolTreeInterface[])
{
	for (const symbolTreeInterface of arr)
	{
		let children = symbolTreeInterface.children;
		if(children == undefined)
			continue;
		for(let child of children)
		{
			child.dispose();
			// by right, u should set them to null
			// this is to remove refernece to object
			// in JS, if object has no reference,
			// it will automatically detected by gargabe collector and dispose them
			// however, doing this would need u to change the interface children:(SymbolTreeItem|null)[]
			// doing so, you have a lot of code change
			// you can just simply set the array to = [];
			// it works the same
			// said chatgpt
			// child = null;
		}
	}
	
	// delete all the elements
	// arr = []; // this one actually creates new empty array and assign it to the variable. This modifies the reference instead of actual object
	arr.length = 0; // this works 
}
