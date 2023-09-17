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