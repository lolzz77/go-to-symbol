# How to Build
1. Run `npm install`
2. Run `npm run watch`
3. Press `F5`

# What

1. this extension will find the JSON file
2. from the JSON file, load the regex

# How to
1. first, click the extension icon on the sidebar first
2. if you didn't, the following step will not show the message on console
3. open `CTRL + P` -> `Dev tools`
4. trigger extension -> `CTRL + P` -> `go-to-symbol:activate`
5. it will output on the console where it will find the JSON file
6. create a JSON file at that location

# JSON File
1. content is as follow
```
    "function" : {
        "myComment" : "",
        "whole" : ["\\b(?:void|int|char|float|double|long|short)\\s+([a-zA-Z_][a-zA-Z_0-9]*)\\s*\\([^)]*\\)\\s*\\{", "g"],
        "opening" : ["{", "}"],
        "before" : ["("]
    },
```
2. name the following, depanding on the language
3. if your langauge is javascript, then
```
javascript.json
```
4. The naming info can be seen on the console shown in dev tool as well

# how it works
0. `myComment` is literally just a note for me.
1. `whole` regex is to capture til the 1st encoutner of `{`
2. then my inner code will handle the function `{` depth to match whole function body
3. It has to match til 1st encoutner of `{`, else, my code will stuck in a loop

4. `opening` is to tell my code that, the opening & closing bracket, is using `{` symbol
5. So that my code can handle the depth scanning.
6. `before/after` is to tell function to extract the symbol name, by detecting the given symbol
7. `before` means the name exists before this symbol
8. `after` means the name exists after this symbol

9. for `comment` regex, i dont need these `opening`, and `before`, thus, just leave it blank

Note:
10. without the `g` flag, ur regex will stuck in forever loop, keep matching the same pattern over and over again
11. comment regex has to come after those regex that has {} handling
12. because in the function, it has comment as well
13. and if you handle comment first, then later when you will fail to remove those pattern in the buffer 'text'
14. the order of regex is IMPORTANT
15. first, scan the function
16. next, scan the rest of patern that also uses `{` pattern
17. then, run `comment` regex to remove all comment
18. then, it will be more easy to run `macro` and `global variable`  regex
