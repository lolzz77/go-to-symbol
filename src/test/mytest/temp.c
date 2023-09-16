#define LOG_RELFS_TRANSACTION_EXEC            "\ttest_powercut();\n" \
                                                "hello"
#define LOG_RELFS_TRANSACTION_EXEC            "\ttest_powercut();\n" \
                                                TEST
#define TEST2                "TEST2"

#define TEST3                TEST2 \
                             TEST1 \
                             "test"

#define TEST3                TEST2 "test"\
                             TEST1 \
                             "test"

#define TEST3                TEST2 TEST TEST TEST\
                             TEST1 \
                             "test"