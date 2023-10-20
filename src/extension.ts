import * as vscode from 'vscode';
import * as func from './function';
import { privateEncrypt } from 'crypto';
/*
 problem
 1. for global variable
 some can omit the `;` symbol
 eg: int test = {
	int x;
 }
 not sure about struct n enum

 2. need to highlight the whole `#if #elif #endif` guarding
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

interface RangeInterface {
	startIndex:number;
	endIndex:number;
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
			backgroundColor: settingObj.backgroundColor,
			isWholeLine: true,
			// this opacity appleis to the text instead of the background color
			// opacity: '0',
			// this can be seen on minimap, the small block colors
			overviewRulerColor: settingObj.overviewRulerColor,
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
			editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
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
		public readonly lineNumber?: number|null,
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
	// add newline at the end of document
	// some of my regex will only stop when detects newline
	text = text + '\n';

	let matchedPatternIndexArr:RangeInterface[] = [];
	let matchedCommentIndexArr:RangeInterface[] = [];
	for (const [key, value] of entries) {
		let regexesArray = value.regexes;
		for(const regexEntries of regexesArray)
		{
			// for debugging only, so i can inspect what example the regex will match
			let sample = regexEntries.comment;
			let regexStr = regexEntries.regex[0];
			let flag = regexEntries.regex[1];
			let regex = new RegExp(regexStr, flag);
			// fail safe check, if no regex, skip
			if(regexStr == '')
				continue;
			/**
			 * Note:
			 * match will be an array
			 * Depending on how you define the `group` in your regex, 
			 * (grou is defined by wrapping regex in `()` symbol)
			 * Then, it will has array for each of these groups
			 * 1st index is always the whole regex
			 * 2nd index is the grouping
			 * Thus, you can extract symbol name by getting the array index
			 * Provided you defined the group regex correctly
			 */
			let match;
			let symbolType:string = key;
			while(match = regex.exec(text))
			{
				let symbolNameIndex = regexEntries.symbolNameIndex;
				let symbol_name = match[symbolNameIndex];
				let lineNumber = 0;
				let operation = regexEntries.operation;
				let ignoreCommentedCode = regexEntries.ignoreCommentedCode;
				let start_index = 0;
				let end_index = 0;
				let to_replace = '';
				let function_opening = regexEntries.opening[0];
				let function_closing = regexEntries.opening[1];
				let range = null;
				
				// for checking whether the current index has found the 1st character or not
				let index = 0;
				let char = '';
				let original_doc_start = 0;
				let original_doc_end = 0;
				let start = null; // rename to smethg better, this is for start = document.positionAt(original_doc_start)
				let end = null;
				let patternHasMatched = false;
				let exactPatternHasMatched = false;
				let commentHasMatched = false;
	
				for(const RangeInterface of matchedPatternIndexArr)
				{
					let currentMatchedStartIndex = match.index;
					let currentMatchedEndIndex = match.index + match[0].length;
					let existedStartIndex = RangeInterface.startIndex;
					let existedEndIndex = RangeInterface.endIndex;
					if(	currentMatchedStartIndex >= existedStartIndex && 
						currentMatchedEndIndex <= existedEndIndex)
					{
						patternHasMatched = true;
						break;
					}
				}
				for(const RangeInterface of matchedCommentIndexArr)
				{
					let currentMatchedStartIndex = match.index;
					let currentMatchedEndIndex = match.index + match[0].length;
					let existedStartIndex = RangeInterface.startIndex;
					let existedEndIndex = RangeInterface.endIndex;
					// for commented pattern matching
					// only match the currentMatchedStartIndex
					// detect whether this start index is within range of existing start index
					if(	currentMatchedStartIndex >= existedStartIndex &&
						currentMatchedStartIndex <= existedEndIndex)
					{
						commentHasMatched = true;
						break;
					}
				}
				
				/* 	have to put symbolType!='comment'
					else, case like
					
					//a
					//b

					the `//b` will be skipped
					due to `//a` has the end index that same with start index of `//b`
				*/
				if((patternHasMatched||commentHasMatched) &&
					ignoreCommentedCode==false &&
					symbolType!='comment')
					continue;
	
				// temporary
				// i want 'guard' regex to able to scan guards in function body
				// but if it is commented code, dont proceed
				// else, will stuck in loop
				if(symbolType=='guard' && commentHasMatched && ignoreCommentedCode)
					continue;

				if (operation == 'remove')
				{
					/**********************************************************************
					 to get whole pattern start & end index
					***********************************************************************/
					start_index = match.index;
					end_index = start_index + match[0].length;
					to_replace = text.substring(start_index, end_index);
					// for `remove` operation, just add into array
					// no need check whether they clash with other index
					// since they are `remove`, just add in array, dont care
					matchedCommentIndexArr.push({startIndex:start_index, endIndex:end_index})
					// that's it for 'remove' operation, no need add into symbol list array
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
	
				else if( operation == 'depth')
				{
					/**********************************************************************
					find the whole function body, using depth method
					***********************************************************************/
	
	
					/**********************************************************************
					search the rest of the function forward
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
					start_index = match.index;
					end_index = index;
					to_replace = text.substring(start_index, end_index)
					matchedPatternIndexArr.push({startIndex:start_index, endIndex:end_index});
	
					/**********************************************************************
					Given the pattern, get the original document position
					***********************************************************************/
					// because currently your 'text' has been modified
					// where, you erased those that matched pattern,
					// to make way for next regex to detect pattern
					// to not make the regex detect duplicate pattern
	
					original_doc_start =  start_index;
					original_doc_end = original_doc_start + to_replace.length;
					start = document.positionAt(original_doc_start);
					end = document.positionAt(original_doc_end);
					range = new vscode.Range(start, end);
	
					/**********************************************************************
					setup symbol name
					***********************************************************************/
					// for javascript, they have anonymous function
					// if not match alphabets, set it to anonymous
	
					// or, if the name is same as symbol type, also set it to anonymous
					if(symbol_name == '')
						symbol_name = 'anonymous'
				}
				// this is for '#ifdef', i want it to highlight how big is the guard range
				else if(operation == 'range')
				{
					/**********************************************************************
					to get the whole pattern
					***********************************************************************/
	
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
					let prev_char = text.charAt(index - 1); // previous char of the current index
					
					let quoteNumber = 0;
					// Purpose: to match til newline or end of document
					// This is for making sure the pattern will detect newline \\n,
					// That, is not withint double quote ""
					// So, make sure your regex matches until newline
					// In order to break the loop, ensure the char is newline
					// and, the quoteNumber is even number
					// That way, im sure the newline, is not within double quote
					while((char!="\n" || (quoteNumber%2!=0)) && index<=text.length)
					{
						// there are cases detecting `\"` withint double qutoe
						// this `\"` shoudl not increase the quoteNumber
						if(char=='"' && prev_char!='\\')
							quoteNumber++;
						index++;
						char=text.charAt(index);
						prev_char=text.charAt(index-1);
					}
	
					// this ugly nested is to handle "\\n" detection
					// kekeke
					// basically, if detects "\\n", means not real newline
					// only when detect "\n", is real newline
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
					start_index = match.index;
					// since below `to_replace` i put +1, here need to put as well
					// else, it will match same pattern twice
					end_index = index + 1;

					// scan matched pattern 1 more time
					// the 1st time it scanned are based on matched regex start and end index
					// my algorithm will further expend the range after match
					// ensure the whole symbol names, body are matched
					// then add the start & end index into array
					// thus, what my regex matched will be short-handed
					// thus, scan 1 more time here
					patternHasMatched = false;
					exactPatternHasMatched = false;
					for(const RangeInterface of matchedPatternIndexArr)
					{
						let currentMatchedStartIndex = start_index;
						let currentMatchedEndIndex = end_index;
						let existedStartIndex = RangeInterface.startIndex;
						let existedEndIndex = RangeInterface.endIndex;
						if(	currentMatchedStartIndex >= existedStartIndex && 
							currentMatchedEndIndex <= existedEndIndex)
						{
							// to handle cases like having exact pattern matched
							// eg: start_index & end_index are exactly the same
							if(currentMatchedStartIndex == existedStartIndex &&
								currentMatchedEndIndex == existedEndIndex)
								{
									exactPatternHasMatched = true;
									break;
								}
							patternHasMatched = true;
						}
					}

					if (patternHasMatched && ignoreCommentedCode==false)
						continue;
					// to handle cases like having exact pattern matched
					// eg: start_index & end_index are exactly the same
					// above `if` will not be true because it checks for `ignoreCommentedCode`
					if (exactPatternHasMatched)
						continue;

					// cannot put end_index+1 here
					// if you have 2 same start_index & end_index range
					// 1st encounter, end_index is 17
					// this line, will push end_index+1 into array
					// 2nd encounter, endindex is 17
					// above checks, what pushed is end_index = 18, thus, it proceed to add end_index = 17 into array
					// then, at this line that tells the system to add end_index + 1 into the array
					// thus, causing duplicate inserts
					matchedPatternIndexArr.push({startIndex:start_index, endIndex:end_index});
					regex.lastIndex = end_index;
					// get the whole pattern
					// i guess substring 2nd argument is not included?.. like python slice()
					// i dk...
					// i forgot why i need +1... i rmb after +1, the `to_replace` will match til newline
					to_replace = text.substring(start_index, end_index + 1)
	
					/**********************************************************************
					It is possible that, there are multiple `defined` in the matching
					extract each of their symbol
					Most of them have `defined` word, but some of them dont
					They confirm use comparison symbol `&&` `||`
					My lazy technique, use `to_replace`, replace all `&& `||` `defined` to comma
					***********************************************************************/
					let temp_to_replace = to_replace.substring(match[1].length);
					let hasMultipleSymbol = false;
					while(temp_to_replace!=undefined &&
						(temp_to_replace.includes("&&")||temp_to_replace.includes("||")))
					{
						hasMultipleSymbol = true;
						// dont put this on the parent `while`
						// If not, `#if defined WORD` will also come here.
						while(temp_to_replace.includes("defined"))
							temp_to_replace = temp_to_replace.replace("defined", ',');
						temp_to_replace = temp_to_replace.replace("&&", ',');
						temp_to_replace = temp_to_replace.replace("||", ',');
						symbol_name=temp_to_replace;
					}
					// remove all the unecessary symbols
					if(hasMultipleSymbol)
					{
						while(symbol_name.includes(' '))
							symbol_name=symbol_name.replace(' ', '');
						while(symbol_name.includes('(')) // eg: defined(WORD)
							symbol_name=symbol_name.replace('(', '');
						while(symbol_name.includes(')')) // eg: defined(WORD)
							symbol_name=symbol_name.replace(')', '');
						while(symbol_name.includes(',,')) // double comma
							symbol_name=symbol_name.replace(',,', ',');
						while(symbol_name.includes('\n'))
							symbol_name=symbol_name.replace('\n', '');
						// this `!` is left by `!defined(WORD)
						// make it to `!WORD`
						// Note: dont do while string.includes('!')
						// it will cause this case `#if x!=2`, the '!' to be removed
						// the '!' is not part of `!defined`, and should not be removed
						while(symbol_name.includes('!,'))
							symbol_name=symbol_name.replace('!,', '!');
						// Below 2 code intention is to replace `,` with `, `
						// that is, with whitespace
						// but i cannot do while string.includes(',')
						// it will stuck in loop
						while(symbol_name.includes(','))
							symbol_name=symbol_name.replace(',', '@');
						while(symbol_name.includes('@'))
							symbol_name=symbol_name.replace('@', ', ');
					}
					
					// remove opening & closing parenthesis, if have
					if(symbol_name.startsWith('(') && symbol_name.endsWith(')'))
						symbol_name = symbol_name.substring(1, symbol_name.length-1)

					/**********************************************************************
					Now, find the `range`
					***********************************************************************/
					let arr = ['#elif', '#else', '#endif', "#if", "#ifdef", "#ifndef"];
					let closest_index = 0;
					// dont remove this, intelli-sense has mistaken this as unused
					let previous_closest_index = closest_index;
					let temp_start_index = start_index;
					let guard_depth = 1; // start at 1, your regex 100% confirm has matched 1 opening
					while(guard_depth!=0)
					{
						/*
							keyword to stop for doing range
							1. #elif
							2. #else
							3. #endif
							
							do not stop if
							1. #if
							2. #ifdef
							3. #ifndef
							are not even number
						*/
						let current_closest_index = 0;
						if(start_index > closest_index)
							temp_start_index = start_index;
						else
							temp_start_index = closest_index;
						for(const str of arr)
						{
							let temp_regex_str = '';
							if(str=='#elif' || str=='#if' || str=='ifdef' || str=='#ifndef')
								temp_regex_str = str + '(?=\\s)'
							else
								temp_regex_str = str
							let temp_regex = new RegExp(temp_regex_str, 'g');
							let temp_match = null;
							let is_within_comment = false;
							while(true)
							{
								temp_match = temp_regex.exec(text);
								if(!temp_match)
									break;
								if(temp_match.index<=temp_start_index)
									continue;
								// check if it's commented line,
								// if it is, skip
								for(const RangeInterface of matchedCommentIndexArr)
								{
									let currentMatchedStartIndex = temp_match.index;
									let currentMatchedEndIndex = temp_match.index + temp_match[0].length;
									let existedStartIndex = RangeInterface.startIndex;
									let existedEndIndex = RangeInterface.endIndex;
									if(	currentMatchedStartIndex >= existedStartIndex && 
										currentMatchedEndIndex <= existedEndIndex)
									{
										is_within_comment = true;
										break;
									}
								}
								if(is_within_comment)
									continue;
								current_closest_index=temp_match.index;
								break;
							}
							if(closest_index==0 || closest_index==temp_start_index)
								closest_index=current_closest_index;
							if(current_closest_index==0)
								current_closest_index=closest_index;
							closest_index = Math.min(closest_index, current_closest_index);
							previous_closest_index = closest_index;
						}
						let substring = text.substring(closest_index);
						let temp_temp_regex = /([^(\s*|\n)]+)/; // match anything, except whitespace, or newline
						let temp_temp_match = temp_temp_regex.exec(substring);
						// hopefully this null checking wont be true
						if(!temp_temp_match)
							continue;
						// these ugly if, else if, is to ensure that, dont just decrement guard_depth if
						// the current keyword is `#else`, if there is another `#ifdef` detected,
						// then only decrement the guard_depth if detects `#endif`
						let keyword = temp_temp_match[1];
						if(keyword=='#endif')
							guard_depth--;
						else if	((keyword=='#elif'||keyword=='#else'||keyword=='#endif') 
							&& guard_depth==1)
								guard_depth--;
						else if((keyword=='#elif'||keyword=='#else'||keyword=='#endif') 
							&& guard_depth!=1)
							continue;
						else
							guard_depth++;
								
					}
					if(closest_index==0)
						closest_index=end_index;
					// now closest_index is on the next line,
					// check if the current line is equal to #endif, if it is, then include this line
					// else, exclude this line
					while(true)
					{
						let keyword = '#endif';
						let temp_closest_index = closest_index;
						let is_endif = true;
						for (const c of keyword)
						{
							char = text.charAt(temp_closest_index++);
							if ( char != c )
							{
								// means the next char is not '#endif'
								// exclude the current line
								is_endif = false;
								break;
							}
						}
						if(is_endif)
						{
							// means the next chat is `#endif`
							// include the current char
							closest_index = temp_closest_index;
						}
						else
						{
							closest_index--;
						}
						break;
					}
					/**********************************************************************
					Given the pattern, get the original document position
					***********************************************************************/
					original_doc_start = start_index;
					original_doc_end = closest_index;
					start = document.positionAt(original_doc_start);
					end = document.positionAt(original_doc_end);
					range = new vscode.Range(start, end);
				}
				else
				{
					/**********************************************************************
					to get the whole pattern
					***********************************************************************/
	
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
					let prev_char = text.charAt(index - 1); // previous char of the current index
					
					let quoteNumber = 0;
					// Purpose: to match til newline or end of document
					// This is for making sure the pattern will detect newline \\n,
					// That, is not withint double quote ""
					// So, make sure your regex matches until newline
					// In order to break the loop, ensure the char is newline
					// and, the quoteNumber is even number
					// That way, im sure the newline, is not within double quote
					while((char!="\n" || (quoteNumber%2!=0)) && index<=text.length)
					{
						// there are cases detecting `\"` withint double qutoe
						// this `\"` shoudl not increase the quoteNumber
						if(char=='"' && prev_char!='\\')
							quoteNumber++;
						index++;
						char=text.charAt(index);
						prev_char=text.charAt(index-1);
					}
	
					// this ugly nested is to handle "\\n" detection
					// kekeke
					// basically, if detects "\\n", means not real newline
					// only when detect "\n", is real newline
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
					// decrease 1, because now end_index is pointing to newline
					// newline == next line, it will highlight the next line
					char = text.charAt(index);
					while(char == "\n")
					{
						index--;
						char = text.charAt(index);
					}

					// save end_index
					start_index = match.index;
					end_index = index;
					matchedPatternIndexArr.push({startIndex:start_index, endIndex:end_index});
					regex.lastIndex = end_index;
					// get the whole pattern
					// i guess substring 2nd argument is not included?.. like python slice()
					// i dk...
					to_replace = text.substring(start_index, end_index + 1)
	
					/**********************************************************************
					Given the pattern, get the original document position
					***********************************************************************/
					original_doc_start = start_index;
					original_doc_end = original_doc_start + to_replace.length;
					start = document.positionAt(original_doc_start);
					end = document.positionAt(original_doc_end);
					range = new vscode.Range(start, end);
				}
				// remove asterik, if have
				while(symbol_name.includes('*'))
					symbol_name=symbol_name.replace('*', '');
				// get the line number base don the original document
				let temp_symbol_name = symbol_name;
				// have to + 1, the number it shows is decreased by 1, i dk why
				lineNumber = editor.document.lineAt(start).lineNumber + 1;
				symbol_name = lineNumber + ': ' + temp_symbol_name; 
	
	
				/**********************************************************************
				finally, push to array
				***********************************************************************/
	
				// Find the index of the object with parent == symbolType
				let parentSymbolIndex = listOfSymbolsArr.findIndex((obj) => obj.parent === symbolType);
				// this is to remove 'null' children from array
				// because i intialized the array to have 'null' children
				if(listOfSymbolsArr[parentSymbolIndex].children[0].label == 'null')
				{
					listOfSymbolsArr[parentSymbolIndex].children[0].dispose();
					listOfSymbolsArr[parentSymbolIndex].children = [];
				}

				let hasDuplicate =false;
				for(const symbolTreeInterface of listOfSymbolsArr)
				{
					for(const child of symbolTreeInterface.children)
					{
						// cannot compare range == child.range
						// cos the range is the object
						// if you compare 2 objects together, even tho their value is same
						// they are still different object
						if(	symbol_name == child.label && 
							lineNumber == child.lineNumber )
							{
								hasDuplicate = true;
								break;
							}
					}
				}
				if(hasDuplicate)
					continue;
				// to insert in ascending order
				// i dk how to sort so...
				let indexToInsert = 0;
				for(const [index,child] of listOfSymbolsArr[parentSymbolIndex].children.entries())
				{
					if(!child.lineNumber)
						continue;
					if(lineNumber<child.lineNumber)
						break;
					indexToInsert = index+1;
				}
				// Push new children to the object at the index
				listOfSymbolsArr[parentSymbolIndex].children.splice(indexToInsert, 0, new SymbolTreeItem(
					symbol_name, 
					vscode.TreeItemCollapsibleState.None, 
					lineNumber,
					range));
			}
		}
	}

	for(let array of listOfSymbolsArr)
	{
		treeArr.push(new SymbolTreeItem(array.parent, vscode.TreeItemCollapsibleState.Expanded, null, null, array.children));
	}
	// free buffer
	entries = null;
	// copyOfEntries = null;
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
