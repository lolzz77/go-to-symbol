#if defined(WORD)
#if !defined TEST
// #if ! defined(TEST) // chatGPT says this is wrong, it includes a space between ! and defined
#if ((defined(WORD)))
#ifdef WORD
#elif defined(WORD)
#elif !defined(WORD)
#elif ! defined(WORD)
// #elif defined WORD // chatGPT says this is wrong, it should have parenthesis around condition
// #if (defined WORD) // This line is missing the defined operator inside the parentheses. It should be #if defined(WORD).
#ifndef TEST


    // "guard": {
    //     "comment1": "",
    //     "whole": [
    //         "(#if|#elif)\\s*([^def|defined])([^\\n]+)\\n",
    //         "g"
    //     ],
    //     "operation": "",
    //     "opening": [
    //         "",
    //         ""
    //     ],
    //     "after": [
    //         " ", "("
    //     ],
    //     "ignoreCommentedCode": true

    /*
        test
    */