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
{
    "function": {
        "whole" : ["function\\s+[a-zA-Z_][a-zA-Z_0-9]*\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\}", "g"],
        "name"  : ["function\\s+([a-zA-Z_][a-zA-Z_0-9]*)\\s*\\([^)]*\\)\\s*\\{", ""]
    }
}
```
2. name the following, depanding on the language
3. if your langauge is javascript, then
```
javascript.json
```
4. The naming info can be seen on the console shown in dev tool as well

# how it works
1. the one that will display on the sidebar, is the `name` regex. 
2. this `name` is dependent on `whole` regex
3. that is, regex `whole` will run first, get the function start & end position
4. then run `name` regex to extract the function name
5. then display the name captured by `name` regex
 