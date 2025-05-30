# Go-to-Symbol

# What
Provide a list of symbols found in the current active editor

![text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/1.png)

It will:
1. Provide list of symbols, depending on how many you provide in /jsonFile/(language).json
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/2.png)
2. Highlight the whole symbol background
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/3.png)
3. Highlight the reange in minimap
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/4.png)

# Info
1. Currently supported language
- C
- CPP
2. Commands
- `Go to symbol: open JSON file`
- To open the JSON file that the extension will read & write regex.
- The setting.json for the extension will also be in this location.
- `Go to symbol: Open Setting JSON file`
- To open the setting JSON file
- `Go to symbol: refresh tree`
- Clear the array, and re-extract the symbols in the current active editor
- `Go to symbol: reset`
- Clear the array, delete all the (language).json & setting.json file
- Will not re-extract the symbols, users have to run `Go to symbol: refresh tree` in order to re-trigger the extension to extract the symbols.
3. If it doesn't support the langauge, you can write up your own (language).json file.
4. You can refer existing (language).json on how to write that.
5. It will create (language).json with empty content in the path shows by the command `Go to symbol: open JSON file`

# How to
1. Just install the extension.
2. Everything will start automatically.

# How it works
1. The repo has the (language).json file
2. The JSON file contains regex to extract the symbols
3. After enabling the extension, it will copy the JSON file to `vscode.env.appRoot + '/go-to-symbol/'` directory
4. This directory varies depending on where vscode is installed.
5. To know where the location on your vscode, run the command `Go to symbol: open JSON file`
6. So, you can modify the regex in that folder.
7. And, if you modified the JSON file in the repo, you have to delete the JSON file that the extension shows you in Step 5.
8. Because, the path that shown in Step 5, is the regex that the extension will read.
9. You can use command `Go to symbol: reset` to clear the directory.

# Why
VSCode build-in already has similar feature
1. Press `CTRL + SHIFT + O`
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/5.png)
2. It will highlight the background
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/6.png)
3. Minimap will reveal the range as well
- ![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/7.png)

HOWEVER

This thing is just ain't convenient.

![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/5.png)

Because it's a 'Quick Input' window.

I wanted something that will stay opened, on the sidebar

Something similar to Notepad++

![Alt text](https://raw.githubusercontent.com/lolzz77/go-to-symbol/main/resources/readme/8.png)

Then I requested them to do it
https://github.com/microsoft/vscode/issues/174178#issue-1581221560

However, the request didn't get enough upvotes to put the request to the backlog.

So, instead, a simple answer is received, to make the quick input stay opened.
https://github.com/microsoft/vscode/issues/174178#issuecomment-1499912922

However, the quick input is opened at the top middle of the editor.

And this disturbs my view.

So, I decided to make my own extension.