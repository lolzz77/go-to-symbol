const fs = require('fs');
const path = require('path');
const vsctm = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');
const readline = require('readline');



/**
 * Utility to read a file as a promise
 */
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => error ? reject(error) : resolve(data));
    })
}

const wasmBin = fs.readFileSync(path.join(__dirname, './../node_modules/vscode-oniguruma/release/onig.wasm')).buffer;
const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => {
    return {
        createOnigScanner(patterns) { return new oniguruma.OnigScanner(patterns); },
        createOnigString(s) { return new oniguruma.OnigString(s); }
    };
});

// Create a registry that can create a grammar from a scope name.
const registry = new vsctm.Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: (scopeName) => {
        if (scopeName === 'source.c') {
            // https://github.com/textmate/javascript.tmbundle/blob/master/Syntaxes/JavaScript.plist
            return readFile(path.join(__dirname, './../jsonFile/c.tmLanguage.json')).then((data) => vsctm.parseRawGrammar(data.toString(), path.join(__dirname, './../jsonFile/c.tmLanguage.json')))
        }
        console.log(`Unknown scope name: ${scopeName}`);
        return null;
    }
});

// Load the JavaScript grammar and any other grammars included by it async.
registry.loadGrammar('source.c').then(grammar => {
    let lines = [];

    // Read file that you want to tokenize
    // Separate them by newline, and push into list
    const fileStream = fs.createReadStream(path.join(__dirname, './test/mytest/test2.c'));
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
        // push each line into list
        lines.push(line);
    });
    
    rl.on('close', () => {
        // tokenize line
        let ruleStack = vsctm.INITIAL;
        let curly_bracket_next = false;
        let pending_end_bracket = false;
        let print_line = false;
        let curly_bracket_count = 0;
        let pending_is_prototype_or_function = false;

        let token_start_index = 0;
        let token_end_index = 0;
        let token_scopes = '';
        let token_line = 0;
        let token_line_substr = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineTokens = grammar.tokenizeLine(line, ruleStack);
            // console.log(`\nTokenizing line: ${line}`);
            let string_to_check = 'class CommandLineInterfaceTest::NullCodeGenerator : public CodeGenerator {'
            if(line.includes(string_to_check))
                console.log(`\nTokenizing line: ${line}`);
            for (let j = 0; j < lineTokens.tokens.length; j++) {
                const token = lineTokens.tokens[j];
                let one, two, three, four = false;
                for(let z = 0; z < token.scopes.length + 1; z ++)
                {
                    /***************************************************************
                    * this is to check the line, what scopes are they
                    ****************************************************************/
                    // if(line.includes(string_to_check))
                    // {
                    //     console.log(`line ${i+1} - token from ${token.startIndex} to ${token.endIndex} ` +
                    //                 `(${line.substring(token.startIndex, token.endIndex)}) ` +
                    //                 `with scopes ${token.scopes.join(', ')}`
                    //     )
                    //     break;
                    // }

                    /***************************************************************
                    * This is to print out function name, and the next curly bracket
                    ****************************************************************/

                    /* Function definition scopes for C
                    * source.c, meta.function.c, meta.function.definition.parameters.c, entity.name.function.c
                    * 
                    */ 
                   
                   /* Function definition scopes for CPP
                   * 
                   */ 
                  
                    if(z < token.scopes.length)
                    {
                        /****
                         * Handling for not to print if it is function prototype
                         */
                        if(pending_is_prototype_or_function)
                        {
                            // means is a prototpe, dont print
                            if(token.scopes[z] == 'punctuation.terminator.statement.c')
                            {
                                pending_is_prototype_or_function = false;
                                curly_bracket_next = false;
                                break;
                            }
                            // is not a prototype, is a function definition, find the function
                            else if(token.scopes[z] == 'punctuation.section.block.begin.bracket.curly.c' 
                                    && curly_bracket_next)
                            {
                                pending_is_prototype_or_function = false;
                                console.log(`line ${token_line} - token from ${token_start_index} to ${token_end_index} ` +
                                            `(${token_line_substr}) ` +
                                            `with scopes ${token_scopes}`
                                );
                            }
                        }

                        /***
                         * Handle printing opening/ending curly bracket of the function
                         */
                        if(token.scopes[z] == 'punctuation.section.block.begin.bracket.curly.c')
                            curly_bracket_count++;
                        else if(token.scopes[z] == 'punctuation.section.block.end.bracket.curly.c')
                            curly_bracket_count--;

                        if(token.scopes[z] == 'punctuation.section.block.begin.bracket.curly.c' 
                            && curly_bracket_next)
                        {
                            curly_bracket_next = false;
                            pending_end_bracket = true;
                            console.log(`line ${i+1} - token from ${token.startIndex} to ${token.endIndex} ` +
                                        `(${line.substring(token.startIndex, token.endIndex)}) ` +
                                        `with scopes ${token.scopes.join(', ')}`
                            );
                        }
                        if(token.scopes[z] == 'punctuation.section.block.end.bracket.curly.c' 
                            && pending_end_bracket
                            && (curly_bracket_count==0)
                        )
                        {
                            pending_end_bracket = false;
                            console.log(`line ${i+1} - token from ${token.startIndex} to ${token.endIndex} ` +
                                        `(${line.substring(token.startIndex, token.endIndex)}) ` +
                                        `with scopes ${token.scopes.join(', ')}`
                            );
                        }

                        /****
                         * Handling for printing function name
                         */
                        if(token.scopes[z] == 'meta.function.c')
                            one = true;
                        if(token.scopes[z] == 'meta.function.definition.parameters.c')
                            two = true;
                        if(token.scopes[z] == 'entity.name.function.c')
                            three = true;

                    }
                    else
                    {
                        if(one && two && three)
                        {
                            pending_is_prototype_or_function = true;
                            token_start_index = token.startIndex;
                            token_end_index = token.endIndex;
                            token_scopes = token.scopes.join(', ');
                            token_line = i+1;
                            token_line_substr = line.substring(token.startIndex, token.endIndex);

                            curly_bracket_next = true;


                        }
                    }
                }
            }
            ruleStack = lineTokens.ruleStack;
        }
    });
    
});

/* OUTPUT:

Unknown scope name: source.js.regexp

Tokenizing line: function sayHello(name) {
 - token from 0 to 8 (function) with scopes source.js, meta.function.js, storage.type.function.js
 - token from 8 to 9 ( ) with scopes source.js, meta.function.js
 - token from 9 to 17 (sayHello) with scopes source.js, meta.function.js, entity.name.function.js
 - token from 17 to 18 (() with scopes source.js, meta.function.js, punctuation.definition.parameters.begin.js
 - token from 18 to 22 (name) with scopes source.js, meta.function.js, variable.parameter.function.js
 - token from 22 to 23 ()) with scopes source.js, meta.function.js, punctuation.definition.parameters.end.js
 - token from 23 to 24 ( ) with scopes source.js
 - token from 24 to 25 ({) with scopes source.js, punctuation.section.scope.begin.js

Tokenizing line:        return "Hello, " + name;
 - token from 0 to 1 (  ) with scopes source.js
 - token from 1 to 7 (return) with scopes source.js, keyword.control.js
 - token from 7 to 8 ( ) with scopes source.js
 - token from 8 to 9 (") with scopes source.js, string.quoted.double.js, punctuation.definition.string.begin.js
 - token from 9 to 16 (Hello, ) with scopes source.js, string.quoted.double.js
 - token from 16 to 17 (") with scopes source.js, string.quoted.double.js, punctuation.definition.string.end.js
 - token from 17 to 18 ( ) with scopes source.js
 - token from 18 to 19 (+) with scopes source.js, keyword.operator.arithmetic.js
 - token from 19 to 20 ( ) with scopes source.js
 - token from 20 to 24 (name) with scopes source.js, support.constant.dom.js
 - token from 24 to 25 (;) with scopes source.js, punctuation.terminator.statement.js

Tokenizing line: }
 - token from 0 to 1 (}) with scopes source.js, punctuation.section.scope.end.js

*/
