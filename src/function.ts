import * as vscode from 'vscode';
import * as fs from 'fs';

export function resetDecoration(decorationTypes: vscode.TextEditorDecorationType[])
{
	// Reset all decoration types to their default state
	for (const type of decorationTypes) {
		type.dispose();
	}
	// delete all the elements
	decorationTypes = [];
}

// Get the JSON File
export function getJSONData(JSONPath: string): any {
	let fileContents;
	let data:any;
	
	fileContents = fs.readFileSync(JSONPath, "utf8");
	if(fileContents == null || fileContents == undefined || fileContents == '')
		return null;

	data = JSON.parse(fileContents);
	return data;
}

// To get the JSON file path that the extension will be looking
// This JSON describe what keyword to recolor
export function getJSONPath(language: string|null): string {
	// if language passed in is null, then set it to 'default.json'
	if(language == null)
		language = 'default'
	return vscode.env.appRoot + '/go-to-symbol/' + language + '.json';
}

// to display file path
export function showFilePath(): any {
	let message = vscode.env.appRoot + '/go-to-symbol/';
	vscode.window.showInformationMessage('Path: ' + message);
}

// to create file, then write the JSON content into it
export function createAndWriteFile(filePath:string, language:string): void {
	let readBuffer = '';
	let readBufferJSON = '';
	let writeBuffer = '';
	let segments;
	let parentDir:any;
	// the current repo json file
	let repo_json_file = __dirname + "/../jsonFile/" + language + ".json";

	// get the parent dir of the file path
	segments = filePath.split('/'); // split the path by slashes
	segments.pop(); // remove the last segment (file name)
	parentDir = segments.join('/'); // join the remaining segments with slashes
	
	// only read if the repo JSON file exists
	if (fs.existsSync(repo_json_file)) {
		readBuffer = fs.readFileSync(repo_json_file, 'utf-8');
		readBufferJSON = JSON.parse(readBuffer);
		writeBuffer = JSON.stringify(readBufferJSON, null, 4); // 4 spaces indentation
	}

	// check if the JSON file that im going to write exists
	if (fs.existsSync(filePath)) {
		return;
	}

	// create parent folder if not exists
	if (!fs.existsSync(parentDir))
	{
		fs.mkdir(parentDir, { recursive : true }, (err) => {
			if (err) {
				console.error(err);
			}
			else
			{
				console.log(parentDir + " created");
			}
		})
	}

	// create file & write
	fs.writeFileSync(filePath, writeBuffer, 'utf8');
}

// To get the current active editor language
export function getCurrentActiveEditorLanguage(): string {
	let language;
	let editor = vscode.window.activeTextEditor;
	
	if (editor) {
		language = editor.document.languageId;
	}
	else
	{
		language = 'No language detected';
	}

	// they are more or less the same
	if(language == 'c')
		language = 'cpp'

	return language;
}