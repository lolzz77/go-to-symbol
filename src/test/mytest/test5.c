#if defined(WORD)
#if !defined
#if ! defined
#if ((defined(WORD)))
#ifdef WORD
#elif defined(WORD)
#elif !defined(WORD)
#elif ! defined(WORD)
#elif defined WORD
#if (defined WORD)


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