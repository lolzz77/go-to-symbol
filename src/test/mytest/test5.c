#if defined(WORD)
#endif
#if !defined TEST
#endif
// #if ! defined(TEST) // chatGPT says this is wrong, it includes a space between ! and defined
#if ((defined(WORD)))
#endif
#ifdef WORD
#elif defined(WORD)
#elif !defined(WORD)
#elif ! defined(WORD)
#endif
// #elif defined WORD // chatGPT says this is wrong, it should have parenthesis around condition
// #if (defined WORD) // This line is missing the defined operator inside the parentheses. It should be #if defined(WORD).
#ifndef TEST
#endif

// chat GPT says this is wrong
// cannot include parenthesis for this
// #ifndef (TEST)
// #endif

#if (ME == VALUE)
errno = run_test(5);
#endif

#if TEST
#elif TEST2
#else
#endif

#if ME == 2
#endif


/* Change to "#if 0" to use the second one */

#ifdef TEST
    #ifdef TEST2
            #if defined(A) || defined(B)
                #define NUM   (2048)
            #else
                #define NUM   (1024)
            #endif
        #define MAX   (512)
        #define NUM   (128)
        #define NUM   (64)
        #pragma DATA(ME, "RAM");
        int ME[MAX];
        #pragma DATA(ME2, "RAM");
        int ME2[MAX];
        #pragma DATA(ME3, "RAM");
        int ME3[MAX*2];
    #elif ME
        #ifndef ME
            int x;
        #else
            int x;
        #endif
        int x;
    #elif defined ME3
        int x;
    #elif defined(ME5)
        int x;
    #elif !defined ME4
        int x;
    #elif !defined(ME6)
        int x;
    #elif (defined(ME7) && defined(ME8))
        int x;
    #elif defined(Z) && (X >= 3 )
        int x;
    #elif (defined(A) && !defined(B)) || defined(C) || defined(D)
        int x;
    #else
        int me;
    #endif
#endif

#if 1
#endif

#if 0
#endif

#if ( ( TEST == 1 ) || ( TEST2 == 1 ) )
#endif

#if ( defined(A) && defined(B) )
#endif

#if ((defined(NUM)) && (NUM > 0U))
#endif

#if defined(A) && !defined(B) && !defined(C)
#endif

#if !( (defined(A) && defined(B)) || defined(C) )
#endif

#if defined(A) && !defined(B) && !defined(C) || defined(D) || defined(E)
#endif

#if defined( A ) && ! defined( B )
#endif

#if defined (A) && ! defined( B )
#endif

#if defined A && defined B
#endif

#if defined A && defined (B)
#endif

#if (defined A) && defined (B)
#endif

#if (defined A) && defined (B)
#elif A || defined(B)
#endif


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