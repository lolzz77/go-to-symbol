// How to
// ./allrepo
/*

test haha

*/


#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <dirent.h>
#include <fcntl.h>
#include <errno.h>
#include <limits.h>
#include <regex.h>

#include "include.h"

int test[]={
    0x00
};

int test[]={
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

int test[] ={
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

int test[]= {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

int test[] = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

int test [] = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

int test[] = {
    // hello
    {5, 10},
    {2, 33}
};

int test2[] = {
    // hello
    {5, 10},
    {2, 33}
}

// test same variable name, would it able to highlight each of them individually
int x = 5;
int x = 5;

/***************************VR****************************************************************/
// #define VR_DELETE_FILE                      "vr_delete_file"
// #define LOG_VR_DELETE_FILE                  "\tmlog(\"ME\", TRACE0, \"%s: " VR_DELETE_FILE " next\", __FUNCTION__);\n"

// #define VR_DELETE_FOLDER                    "vr_delete_folder"
// #define LOG_VR_DELETE_FOLDER                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_delete_folder next\", __FUNCTION__);\n"
// #define LOG_VR_DELETE_FOLDER                "\tmlog(\"ME\", TRACE0, \"%s: " VR_DELETE_FOLDER " next\", __FUNCTION__);\n"

// #define VR_DELETE_CP_RANGE_TYPES                      "vr_delete_cp_range_types"
// #define LOG_VR_DELETE_CP_RANGE_TYPES                  "\tmlog(\"ME\", TRACE0, \"%s: " VR_DELETE_CP_RANGE_TYPES " next\", __FUNCTION__);\n"

// #define VR_DELETE_CP_IDS_OF_TYPE                      "vr_delete_cp_ids_of_type"
// #define LOG_VR_DELETE_CP_IDS_OF_TYPE                  "\tmlog(\"ME\", TRACE0, \"%s: " VR_DELETE_CP_IDS_OF_TYPE " next\", __FUNCTION__);\n"

// #define VR_DELETE_FOLDER_RECURSIVE                      "vr_delete_folder_recursive"
// #define LOG_VR_DELETE_FOLDER_RECURSIVE                  "\tmlog(\"ME\", TRACE0, \"%s: " VR_DELETE_FOLDER_RECURSIVE " next\", __FUNCTION__);\n"

// #define VR_WRITE_CP_NEXT                      "vr_write_cp_next"
// #define LOG_VR_WRITE_CP_NEXT                  "\tmlog(\"ME\", TRACE0, \"%s: " VR_WRITE_CP_NEXT " next\", __FUNCTION__);\n"

// #define VR_READ_FILE                    "vr_read_file"
// #define LOG_VR_READ_FILE                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_read_file next\", __FUNCTION__);\n"
// #define LOG_VR_READ_FILE                    "\tmlog(\"ME\", TRACE0, \"%s: " VR_READ_FILE " next\", __FUNCTION__);\n"

// #define VR_READ_CP_NEXT                    "vr_read_cp_next"
// #define LOG_VR_READ_CP_NEXT                    "\tmlog(\"ME\", TRACE0, \"%s: " VR_READ_CP_NEXT " next\", __FUNCTION__);\n"

// #define VR_SNAPSHOT_FOLDER                    "vr_snapshot_folder"
// #define LOG_VR_SNAPSHOT_FOLDER                    "\tmlog(\"ME\", TRACE0, \"%s: " VR_SNAPSHOT_FOLDER " next\", __FUNCTION__);\n"

// #define VR_SNAPSHOT_FILE                    "vr_snapshot_file"
// #define LOG_VR_SNAPSHOT_FILE                    "\tmlog(\"ME\", TRACE0, \"%s: " VR_SNAPSHOT_FILE " next\", __FUNCTION__);\n"

// #define VR_GET_DIR_LISTING              "vr_get_dir_listing"
// #define LOG_VR_GET_DIR_LISTING                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_get_dir_listing next\", __FUNCTION__);\n"
// #define LOG_VR_GET_DIR_LISTING              "\tmlog(\"ME\", TRACE0, \"%s: " VR_GET_DIR_LISTING " next\", __FUNCTION__);\n"


// #define VR_COMMIT_TRANSACTION           "vr_commit_transaction"
// #define LOG_VR_COMMIT_TRANSACTION                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_commit_transaction next\", __FUNCTION__);\n"
// #define LOG_VR_COMMIT_TRANSACTION           "\tmlog(\"ME\", TRACE0, \"%s: " VR_COMMIT_TRANSACTION " next\", __FUNCTION__);\n"


// #define VR_GET_FILE_SIZE                "vr_get_file_size"
// #define LOG_VR_GET_FILE_SIZE                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_get_file_size next\", __FUNCTION__);\n"
// #define LOG_VR_GET_FILE_SIZE                "\tmlog(\"ME\", TRACE0, \"%s: " VR_GET_FILE_SIZE " next\", __FUNCTION__);\n"



// #define VR_CREATE_DIRECTORY             "vr_create_directory"
// #define LOG_VR_CREATE_DIRECTORY                    "\tCRITICAL_MLOG(\"ME\", \"%s: vr_create_directory next\", __FUNCTION__);\n"
// #define LOG_VR_CREATE_DIRECTORY             "\tmlog(\"ME\", TRACE0, \"%s: " VR_CREATE_DIRECTORY " next\", __FUNCTION__);\n"

// #define VR_WRITE_FILE                   "vr_write_file"
// #define LOG_VR_WRITE_FILE                   "\tmlog(\"ME\", TRACE0, \"%s: " VR_WRITE_FILE " next\", __FUNCTION__);\n"

// #define VR_WRITE_SECTOR                 "vr_write_sector"
// #define LOG_VR_WRITE_SECTOR                 "\tmlog(\"ME\", TRACE0, \"%s: " VR_WRITE_SECTOR " next\", __FUNCTION__);\n"

// #define VR_RESET                                "vr_reset"
// #define LOG_VR_RESET                        "\tmlog(\"ME\", TRACE0, \"%s: " VR_RESET " next\", __FUNCTION__);\n"

// #define VR_RESET_CONNECTIVITY                                "vr_reset_connectivity"
// #define LOG_VR_RESET_CONNECTIVITY                        "\tmlog(\"ME\", TRACE0, \"%s: " VR_RESET_CONNECTIVITY " next\", __FUNCTION__);\n"

/***************************MISC****************************************************************/
// #define WRITE_FILE_INTERNAL             "write_file_internal"
// #define LOG_WRITE_FILE_INTERNAL                    "\tCRITICAL_MLOG(\"ME\", \"%s: write_file_internal next\", __FUNCTION__);\n"
// #define LOG_WRITE_FILE_INTERNAL             "\tmlog(\"ME\", TRACE0, \"%s: " WRITE_FILE_INTERNAL " next\", __FUNCTION__);\n"

// #define HANDLE_INCOMING_MSG             "handleIncomingMsg"
// #define LOG_HANDLE_INCOMING_MSG             "\tmlog(\"ME\", TRACE0, \"%s: " HANDLE_INCOMING_MSG " next\", __FUNCTION__);\n"

// #define RADIO_POWERDOWN                     "radio_powerdown"
// #define LOG_RADIO_POWERDOWN                  "\tprintf(\"MEE %s:%d " RADIO_POWERDOWN " next\\r\\n\", __FUNCTION__, __LINE__);\n"

// #define BL_READ_GLOBAL_MARKER                 "bl_read_global_marker"
// #define LOG_BL_READ_GLOBAL_MARKER             "\tprintf(\"MEE %s:%s:%d " BL_READ_GLOBAL_MARKER " next\\r\\n\", __FILE__, __FUNCTION__, __LINE__);\n"

// #define BL_WRITE_GLOBAL_MARKER                "bl_write_global_marker"
// #define LOG_BL_WRITE_GLOBAL_MARKER            "\tprintf(\"MEE %s:%s:%d " BL_WRITE_GLOBAL_MARKER " next\\r\\n\", __FILE__, __FUNCTION__, __LINE__);\n"
// #define LOG_BL_WRITE_GLOBAL_MARKER            "\t// Temporary log, to be removed\n" \
//                                               "\tprintf(\"ALERT %s:%d " BL_WRITE_GLOBAL_MARKER " next! Sleep for 5s, Power cut now!\\r\\n\", __FUNCTION__, __LINE__);\n" \
//                                               "\tdelay_msec(5000);\n"

// #define RELFS_TRANSACTION_EXEC                "relfs_transaction_exec"
// #define LOG_RELFS_TRANSACTION_EXEC            "\ttest_powercut();\n"
// #define LOG_RELFS_TRANSACTION_EXEC            "\tprintf(\"MEE %s:%s:%d " RELFS_TRANSACTION_EXEC " next\\r\\n\", __FILE__, __FUNCTION__, __LINE__);\n"
// #define LOG_RELFS_TRANSACTION_EXEC            "\t// Temporary log, to be removed\n" \
//                                               "\tprintf(\"ALERT %s:%d " RELFS_TRANSACTION_EXEC " next! Sleep for 5s, Power cut now!\\r\\n\", __FUNCTION__, __LINE__);\n" \
//                                               "\tdelay_msec(5000);\n"

// #define RELFS_TRANSACTION_EXEC_MULTIPLE                "relfs_transaction_exec_multiple"
// #define LOG_RELFS_TRANSACTION_EXEC_MULTIPLE            "\ttest_powercut();\n"

// #define TEST_POWERCUT                "test_powercut"
// #define LOG_TEST_POWERCUT            "\tprintf(\"MEE %s:%d " TEST_POWERCUT " next\\r\\n\", __FUNCTION__, __LINE__);\n"

// #define RELFS_TRANSACTION_EXEC_AND_LOOP                "relfs_transaction_exec"
// #define LOG_RELFS_TRANSACTION_EXEC_AND_LOOP            "\ttest_powercut();\n"

#define LOADIMAGETORAM                "loadImageToRam"
#define LOG_LOADIMAGETORAM            "\tprintf(\"MEE %s:%d " LOADIMAGETORAM " next\\r\\n\", __FUNCTION__, __LINE__);\n"

#define LOAD_DSP_IMAGE_TO_RAM                "load_dsp_image_to_ram"
#define LOG_LOAD_DSP_IMAGE_TO_RAM            "\tprintf(\"MEE %s:%d " LOAD_DSP_IMAGE_TO_RAM " next\\r\\n\", __FUNCTION__, __LINE__);\n"

/*  test_powercut function */
#define TEST                "TEST"
#define TEST_POWERCUT_FUNCTION \
"void test_powercut()\n" \
"{\n" \
    "\tBTN_PRESSED_TYPE me_force_failure = BTN_NONE_PRESSED;\n" \
    "\tif(TRUE == board_is_rajang())\n" \
    "\t{\n"\
        "\t\tGPIO_SET_DATA23 = (1UL << 22); // must set, else LED wont work\n" \
        "\t\tGPIO_DIR23 &= ~(1UL << 22); // on RED LED\n" \
        "\t\twhile(FALSE == IS_PTT_PRESSED(me_force_failure))\n" \
        "\t\t{\n" \
            "\t\t\tme_force_failure = (BTN_PRESSED_TYPE)(check_for_force_failure());\n" \
        "\t\t}\n" \
        "\t\tGPIO_DIR23 |= (1UL << 22); // off RED LED\n" \
    "\t}\n" \
    "\telse if(TRUE == board_is_belize_plus()) // belize plus, belize plus nxp\n" \
    "\t{\n" \
        "\t\tGPIO_SET_DATA45 = (1UL << 2); // must set, else LED wont work\n" \
        "\t\tGPIO_DIR45 &= ~(1UL << 2); // on RED LED\n"\
        "\t\twhile(FALSE == IS_PTT_PRESSED(me_force_failure))\n" \
        "\t\t{\n" \
            "\t\t\tme_force_failure = (BTN_PRESSED_TYPE)(check_for_force_failure());\n"\
        "\t\t}\n"\
        "\t\tGPIO_DIR45 |= (1UL << 2); // off RED LED\n"\
    "\t}\n"\
    "\telse if(TRPUE == board_is_mackenzie())\n"\
    "\t{\n"\
        "\t\tcpcap_write_reg(CPCAP_ADDR_394, 0x0022); //Turn on SW5, SW5 needs to be turn on when LED is on, else it will be dim. (0d394)\n"\
        "\t\tcpcap_write_reg(CPCAP_ADDR_1027, 0x0BE5); // on Red LED\n"\
        "\t\twhile(FALSE == IS_PTT_PRESSED(me_force_failure))\n"\
        "\t\t{\n"\
            "\t\t\t\tme_force_failure = (BTN_PRESSED_TYPE)(check_for_force_failure());\n"\
        "\t\t}\n"\
        "\t\tcpcap_write_reg(CPCAP_ADDR_1027, 0); // off Red LED\n"\
    "\t}\n"\
    "\tme_force_failure = BTN_NONE_PRESSED;\n"\
    "\tdelay_msec(2000);\n"\
"}\n"
#define TEST2                "TEST2"
#define TEST3                TEST2 \
                             TEST1 \
                             "test"
#define TEST4                4
#define TEST5                5

#ifdef MEME
#define NIAMA 5
#else
#define NIAMA
#endif

const char TEST[]               = "00";

/*function prototype*/
static int read_line (char* file_to_open);
int main (int argc, char* argv[]);

/*---------------GLOBAL VARIABLE----------------------*/
// For test_powercut() function definition
// I want to write the function definition for once, in a file that i want, and before encoutnering the 1st function in the file
static int is_first_function = TRUE; 
static int        is_first_function2       = TRUE; 
static int *is_first_function3 = TRUE; 
static int testest; 
int test3[]={
    0x00
};

int test4[]={
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};
typedef struct me
{
    int x;
} me_t;
typedef struct me
{
    int x;
}

typedef enum me2
{
    int t;
} me2_t;
/*
***************/
static int read_line (char* file_to_open)
{
    #define TEST TEST
    #define HELLO HELLO
    char line_read[MAX_READ_SIZE_PER_LINE] = {'\0'};
    unsigned int old_file_size = 0;
    FILE* fp = NULL;
    char* buffer = NULL;
    int is_comment = FALSE;
    char* temp = NULL;
    int ret = FAILURE;
    int bytes_written = 0;
    char* str_to_write = NULL;
    unsigned int new_file_size = 0;
    int prev_seek = 0;
    // for relfs_transaction_exec()
    // i have loop to run relfs_transaction_exec() multiple times
    // But i want the test_powercut() to be printed before the loop, instead of before relfs_transaction_exec() that's inside the loop

    fp = fopen(file_to_open, "r+");
    if(NULL == fp)
    {
        printf("%s:%d path = %s, err = %d\n", __FUNCTION__, __LINE__, file_to_open, errno);
        printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
        exit(0);
    }

    fseek(fp, 0, SEEK_END);     // seek end of file
    old_file_size = ftell(fp);  // get the whole file size
    fseek(fp, 0, SEEK_SET);     // set back to start of file

    // read file content line by line & write
    while(NULL != fgets(line_read, MAX_READ_SIZE_PER_LINE, fp))
    {
        // if is comment, have to update prev_seek. Then skip the line
        if(TRUE == is_comment_f_advance(line_read, &is_comment, &prev_seek, fp))
            continue;

        // skip logs line
        if 
        (
            strstr(line_read, "CONN_CM_LOG_") ||
            strstr(line_read, "CRITICAL_MLOG") ||
            strstr(line_read, "CONN_RCMP_LOG_CRITICAL") ||
            strstr(line_read, "mlog") ||
            strstr(line_read, "UPRINTF") ||
            strstr(line_read, "record_update_info")
        )
        {
            prev_seek = ftell(fp);
            continue;
        }

#ifdef VR_COMMIT_TRANSACTION
        if 
        (
            strstr(line_read, VR_COMMIT_TRANSACTION) && 
            (NULL == strstr(line_read, VR_COMMIT_TRANSACTION "_")) && // skip if it whole word is not vr_commit_transaction entirely
            (NULL == strstr(line_read, VR_COMMIT_TRANSACTION ".h")) && // skip if is header file
            (!match(line_read)) && // im adding logs to callers, so if match function definition, skip
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) // if not equal to regex#17
        )
        {
            if(TRUE == is_within_comment(line_read, VR_COMMIT_TRANSACTION))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_COMMIT_TRANSACTION);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_GET_DIR_LISTING
        if 
        (
            strstr(line_read, VR_GET_DIR_LISTING) && 
            (NULL == strstr(line_read, VR_GET_DIR_LISTING "_")) && // skip if it whole word is not vr_get_dir_listing entirely
            (NULL == strstr(line_read, VR_GET_DIR_LISTING ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_GET_DIR_LISTING))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_GET_DIR_LISTING);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef WRITE_FILE_INTERNAL
        if 
        (
            strstr(line_read, WRITE_FILE_INTERNAL) && 
            (NULL == strstr(line_read, WRITE_FILE_INTERNAL "_")) && // skip if it whole word is not write_file_internal entirely
            (NULL == strstr(line_read, WRITE_FILE_INTERNAL ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, WRITE_FILE_INTERNAL))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_WRITE_FILE_INTERNAL);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_DELETE_FILE
        if 
        (
            strstr(line_read, VR_DELETE_FILE) && 
            (NULL == strstr(line_read, VR_DELETE_FILE "_")) && // skip if it whole word is not VR_DELETE_FILE entirely
            (NULL == strstr(line_read, VR_DELETE_FILE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_DELETE_FILE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_DELETE_FILE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_DELETE_CP_RANGE_TYPES
        if 
        (
            strstr(line_read, VR_DELETE_CP_RANGE_TYPES) && 
            (NULL == strstr(line_read, VR_DELETE_CP_RANGE_TYPES "_")) && // skip if it whole word is not VR_DELETE_CP_RANGE_TYPES entirely
            (NULL == strstr(line_read, VR_DELETE_CP_RANGE_TYPES ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_DELETE_CP_RANGE_TYPES))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_DELETE_CP_RANGE_TYPES);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_DELETE_CP_IDS_OF_TYPE
        if 
        (
            strstr(line_read, VR_DELETE_CP_IDS_OF_TYPE) && 
            (NULL == strstr(line_read, VR_DELETE_CP_IDS_OF_TYPE "_")) && // skip if it whole word is not VR_DELETE_CP_IDS_OF_TYPE entirely
            (NULL == strstr(line_read, VR_DELETE_CP_IDS_OF_TYPE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_DELETE_CP_IDS_OF_TYPE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_DELETE_CP_IDS_OF_TYPE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_DELETE_FOLDER_RECURSIVE
        if 
        (
            strstr(line_read, VR_DELETE_FOLDER_RECURSIVE) && 
            (NULL == strstr(line_read, VR_DELETE_FOLDER_RECURSIVE "_")) && // skip if it whole word is not VR_DELETE_FOLDER_RECURSIVE entirely
            (NULL == strstr(line_read, VR_DELETE_FOLDER_RECURSIVE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_DELETE_FOLDER_RECURSIVE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_DELETE_FOLDER_RECURSIVE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_WRITE_CP_NEXT
        if 
        (
            strstr(line_read, VR_WRITE_CP_NEXT) && 
            (NULL == strstr(line_read, VR_WRITE_CP_NEXT "_")) && // skip if it whole word is not VR_WRITE_CP_NEXT entirely
            (NULL == strstr(line_read, VR_WRITE_CP_NEXT ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_WRITE_CP_NEXT))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_WRITE_CP_NEXT);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_READ_CP_NEXT
        if 
        (
            strstr(line_read, VR_READ_CP_NEXT) && 
            (NULL == strstr(line_read, VR_READ_CP_NEXT "_")) && // skip if it whole word is not VR_READ_CP_NEXT entirely
            (NULL == strstr(line_read, VR_READ_CP_NEXT ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_READ_CP_NEXT))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_READ_CP_NEXT);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_SNAPSHOT_FOLDER
        if 
        (
            strstr(line_read, VR_SNAPSHOT_FOLDER) && 
            (NULL == strstr(line_read, VR_SNAPSHOT_FOLDER "_")) && // skip if it whole word is not VR_SNAPSHOT_FOLDER entirely
            (NULL == strstr(line_read, VR_SNAPSHOT_FOLDER ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_SNAPSHOT_FOLDER))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_SNAPSHOT_FOLDER);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_SNAPSHOT_FILE
        if 
        (
            strstr(line_read, VR_SNAPSHOT_FILE) && 
            (NULL == strstr(line_read, VR_SNAPSHOT_FILE "_")) && // skip if it whole word is not VR_SNAPSHOT_FILE entirely
            (NULL == strstr(line_read, VR_SNAPSHOT_FILE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_SNAPSHOT_FILE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_SNAPSHOT_FILE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_GET_FILE_SIZE
        if 
        (
            strstr(line_read, VR_GET_FILE_SIZE) && 
            (NULL == strstr(line_read, VR_GET_FILE_SIZE "_")) && // skip if it is vr_get_dir_listing_nolock, just specify "_", in case got vr_get_dir_listing_ret
            (NULL == strstr(line_read, VR_GET_FILE_SIZE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_GET_FILE_SIZE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_GET_FILE_SIZE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_READ_FILE
        if 
        (
            strstr(line_read, VR_READ_FILE) && 
            (NULL == strstr(line_read, VR_READ_FILE "_")) && // skip if it is vr_read_file_nolock, just specify "_", in case got vr_read_file_ret
            (NULL == strstr(line_read, VR_READ_FILE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0))
        )
        {
            if(TRUE == is_within_comment(line_read, VR_READ_FILE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_READ_FILE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_DELETE_FOLDER
        if 
        (
            strstr(line_read, VR_DELETE_FOLDER) && 
            (NULL == strstr(line_read, VR_DELETE_FOLDER "_")) && // skip if it whole word is not vr_delete_folder entirely
            (NULL == strstr(line_read, VR_DELETE_FOLDER ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_DELETE_FOLDER))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_DELETE_FOLDER);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_CREATE_DIRECTORY
        if 
        (
            strstr(line_read, VR_CREATE_DIRECTORY) && 
            (NULL == strstr(line_read, VR_CREATE_DIRECTORY "_")) && // skip if it whole word is not vr_create_directory entirely
            (NULL == strstr(line_read, VR_CREATE_DIRECTORY ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_CREATE_DIRECTORY))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_CREATE_DIRECTORY);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_WRITE_FILE
        if 
        (
            strstr(line_read, VR_WRITE_FILE) && 
            (NULL == strstr(line_read, VR_WRITE_FILE "_")) && // skip if it whole word is not vr_write_file entirely
            (NULL == strstr(line_read, VR_WRITE_FILE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_WRITE_FILE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_WRITE_FILE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_WRITE_SECTOR
        if 
        (
            strstr(line_read, VR_WRITE_SECTOR) && 
            (NULL == strstr(line_read, VR_WRITE_SECTOR "_")) && // skip if it whole word is not vr_write_sector entirely
            (NULL == strstr(line_read, VR_WRITE_SECTOR ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_WRITE_SECTOR))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_WRITE_SECTOR);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef HANDLE_INCOMING_MSG
        if 
        (
            strstr(line_read, HANDLE_INCOMING_MSG) && 
            (NULL == strstr(line_read, HANDLE_INCOMING_MSG "_")) && // skip if it whole word is not handle_incoming_msg entirely
            (NULL == strstr(line_read, HANDLE_INCOMING_MSG ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, HANDLE_INCOMING_MSG))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_HANDLE_INCOMING_MSG);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef BL_READ_GLOBAL_MARKER
        if 
        (
            strstr(line_read, BL_READ_GLOBAL_MARKER) && 
            (NULL == strstr(line_read, BL_READ_GLOBAL_MARKER "_")) && // skip if it whole word is not BL_READ_GLOBAL_MARKER entirely
            (NULL == strstr(line_read, BL_READ_GLOBAL_MARKER ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, BL_READ_GLOBAL_MARKER))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_BL_READ_GLOBAL_MARKER);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef BL_WRITE_GLOBAL_MARKER
        if 
        (
            strstr(line_read, BL_WRITE_GLOBAL_MARKER) && 
            (NULL == strstr(line_read, BL_WRITE_GLOBAL_MARKER "_")) && // skip if it whole word is not BL_WRITE_GLOBAL_MARKER entirely
            (NULL == strstr(line_read, BL_WRITE_GLOBAL_MARKER ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, BL_WRITE_GLOBAL_MARKER))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_BL_WRITE_GLOBAL_MARKER);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef RELFS_TRANSACTION_EXEC
        if(TRUE == is_first_function)
        {
            if  
            (
                // if file is powerup_init.c
                strstr(file_to_open, "powerup_init.c") &&
                // and is function
                match(line_read) &&
                // and not function prototype
                NULL == strstr(line_read, ";")
            )
            {
                ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, TEST_POWERCUT_FUNCTION);
                is_first_function = FALSE;
            }
        }
        if 
        (
            strstr(line_read, RELFS_TRANSACTION_EXEC) && 
            // comment this out, we want to put log for relfs_transaction_exec_multiple() one
            // (NULL == strstr(line_read, RELFS_TRANSACTION_EXEC "_")) && // skip if it whole word is not RELFS_TRANSACTION_EXEC entirely
            (NULL == strstr(line_read, RELFS_TRANSACTION_EXEC ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, RELFS_TRANSACTION_EXEC))
                continue;
            // skip the one in relfs_transaction_exec_multiple() function definition in file_access.c
            if(strstr(line_read, "relfs_transaction_exec((char *)rel_partition[index], FALSE)"))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_RELFS_TRANSACTION_EXEC);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef RELFS_TRANSACTION_EXEC_AND_LOOP
        if(TRUE == is_first_function)
        {
            if  
            (
                // if file is powerup_init.c
                strstr(file_to_open, "powerup_init.c") &&
                // and is function
                match(line_read) &&
                // and not function prototype
                NULL == strstr(line_read, ";")
            )
            {
                ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, TEST_POWERCUT_FUNCTION);
                is_first_function = FALSE;
            }
        }
        if(TRUE == is_written)
        {
            if(strstr(line_read, RELFS_TRANSACTION_EXEC_AND_LOOP))
            {
                is_written = FALSE;
                continue;
            }
            else
                continue;
        }

        // scan relfs_transaction_exec that is not in 'for' loop first
        if  
        (   
            strstr(line_read, RELFS_TRANSACTION_EXEC_AND_LOOP) &&
            (!match(line_read))
        )
        {
            if(TRUE == is_within_comment(line_read, RELFS_TRANSACTION_EXEC_AND_LOOP))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_RELFS_TRANSACTION_EXEC_AND_LOOP);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }

        // then only scan those in 'for' loop
        if 
        (   
            0 == regexec( &reegex_no_match13, line_read, 0, NULL, 0) &&
            strstr(line_read, "transaction_count")
        )
        {
            if(TRUE == is_within_comment(line_read, RELFS_TRANSACTION_EXEC_AND_LOOP))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_RELFS_TRANSACTION_EXEC_AND_LOOP);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef RADIO_POWERDOWN
        if 
        (
            strstr(line_read, RADIO_POWERDOWN) && 
            (NULL == strstr(line_read, RADIO_POWERDOWN "_")) && // skip if it whole word is not RADIO_POWERDOWN entirely
            (NULL == strstr(line_read, RADIO_POWERDOWN ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, RADIO_POWERDOWN))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_RADIO_POWERDOWN);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef RELFS_TRANSACTION_EXEC_MULTIPLE
        if(TRUE == is_first_function)
        {
            if  
            (
                // if file is powerup_init.c
                strstr(file_to_open, "powerup_init.c") &&
                // and is function
                match(line_read) &&
                // and not function prototype
                NULL == strstr(line_read, ";")
            )
            {
                ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, TEST_POWERCUT_FUNCTION);
                is_first_function = FALSE;
            }
        }
        if 
        (
            strstr(line_read, RELFS_TRANSACTION_EXEC_MULTIPLE) && 
            (NULL == strstr(line_read, RELFS_TRANSACTION_EXEC_MULTIPLE "_")) && // skip if it whole word is not RELFS_TRANSACTION_EXEC_MULTIPLE entirely
            (NULL == strstr(line_read, RELFS_TRANSACTION_EXEC_MULTIPLE ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, RELFS_TRANSACTION_EXEC_MULTIPLE))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_RELFS_TRANSACTION_EXEC_MULTIPLE);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef TEST_POWERCUT
        if(TRUE == is_first_function)
        {
            if  
            (
                // if file is powerup_init.c
                strstr(file_to_open, "powerup_init.c") &&
                // and is function
                match(line_read) &&
                // and not function prototype
                NULL == strstr(line_read, ";")
            )
            {
                ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, TEST_POWERCUT_FUNCTION);
                is_first_function = FALSE;
            }
        }
        if 
        (
            strstr(line_read, TEST_POWERCUT) && 
            (NULL == strstr(line_read, TEST_POWERCUT "_")) && // skip if it whole word is not TEST_POWERCUT entirely
            (NULL == strstr(line_read, TEST_POWERCUT ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, TEST_POWERCUT))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_TEST_POWERCUT);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_RESET
        if 
        (
            strstr(line_read, VR_RESET) && 
            (NULL == strstr(line_read, VR_RESET "_")) && // skip if it whole word is not VR_RESET entirely
            (NULL == strstr(line_read, VR_RESET ".h")) && // skip if is header file
            (NULL == strstr(line_read, "void vr_reset(void);")) && // see how to exlucde this in future regex coding
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0)) 
        )
        {
            if(TRUE == is_within_comment(line_read, VR_RESET))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_RESET);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef VR_RESET_CONNECTIVITY
        if 
        (
            strstr(line_read, VR_RESET_CONNECTIVITY) &&
            (NULL == strstr(line_read, VR_RESET_CONNECTIVITY "_")) && // skip if it whole word is not VR_RESET_CONNECTIVITY entirely
            (NULL == strstr(line_read, VR_RESET_CONNECTIVITY ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0))
        )
        {
            if(TRUE == is_within_comment(line_read, VR_RESET_CONNECTIVITY))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_VR_RESET_CONNECTIVITY);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef LOADIMAGETORAM
        if 
        (
            strstr(line_read, LOADIMAGETORAM) &&
            (NULL == strstr(line_read, LOADIMAGETORAM "_")) && // skip if it whole word is not LOADIMAGETORAM entirely
            (NULL == strstr(line_read, LOADIMAGETORAM ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0))
        )
        {
            if(TRUE == is_within_comment(line_read, LOADIMAGETORAM))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_LOADIMAGETORAM);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
#ifdef LOAD_DSP_IMAGE_TO_RAM
        if 
        (
            strstr(line_read, LOAD_DSP_IMAGE_TO_RAM) &&
            (NULL == strstr(line_read, LOAD_DSP_IMAGE_TO_RAM "_")) && // skip if it whole word is not LOAD_DSP_IMAGE_TO_RAM entirely
            (NULL == strstr(line_read, LOAD_DSP_IMAGE_TO_RAM ".h")) && // skip if is header file
            (!match(line_read)) &&
            (1 == regexec( &reegex_no_match17, line_read, 0, NULL, 0))
        )
        {
            if(TRUE == is_within_comment(line_read, LOAD_DSP_IMAGE_TO_RAM))
                continue;
            ret = write_file_short(fp, file_to_open, temp, buffer, str_to_write, line_read, &prev_seek, &old_file_size, &new_file_size, &bytes_written, LOG_LOAD_DSP_IMAGE_TO_RAM);
            if(SUCCESS != ret)
            {
                printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                exit(0);
            }
        }
#endif
        // Record and store into "previous" variable
        prev_seek = ftell(fp);

    } // while
    
    // If has log written in file, then write the library
    // Dont check if lib has included it or not, just include. Becos there are files that #ifdef UNIT_TEST n only then it includes <stdio.h>
    if(SUCCESS == ret)
    {
        new_file_size   = old_file_size + strlen(LIB_TO_WRITE);

        fseek(fp, 0, SEEK_SET);             // set to start of file
        temp            = realloc(buffer, old_file_size + 1); // old_file_size has been updated to size that written log from above
        if(NULL == temp)
        {
            printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
            exit(0);
        }
        else
            buffer = temp;
        fread(buffer, old_file_size, 1, fp);    // read the whole content from start
        fseek(fp, 0, SEEK_SET);             // after read, set to start of file again
        temp            = realloc(str_to_write, new_file_size + 1);
        if(NULL == temp)
        {
            printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
            exit(0);
        }
        else
            str_to_write = temp;
        snprintf(str_to_write, new_file_size + 1, "%s%s", LIB_TO_WRITE, buffer);

        bytes_written   = fwrite(str_to_write , 1, new_file_size, fp);
        if(bytes_written != new_file_size)
        {
            printf("%s:%d Terminate.\n", __FUNCTION__, __LINE__);
            exit(0);
        }

        // fseek(fp, 0, SEEK_END); // not needed, after write, means at the end of file ady. Since u're writting whole content

    }

    // Output what file has been written
    // Can park together with 'if' from above, but this is purely readability and cosmetics
    if(SUCCESS == ret)
    {
        printf("Writting ");
        puts(file_to_open);
    }

cleanup:
    if(NULL != fp)
    {
        fclose(fp);
        fp = NULL;
    }
    if(NULL != buffer)
    {
        free(buffer); // dk why this cause double free error
        buffer = NULL;
    }
    if(NULL != str_to_write)
    {
        free(str_to_write);
        str_to_write = NULL;
    }
    if(NULL != temp)
    {
        // free(temp); // already freed from either buffer or str_to_write
        temp = NULL;
    }
    return SUCCESS;
}
/*
test
****************************/
int main (int argc, char* argv[])
{
    DIR* dp = NULL; // maybe is Directory Pointer, to open directory
    struct dirent* ep; // maybe is Directory Entry Pointer, to store detail of directory
    char* path = NULL; // the path to repo/dir that contains source file to append logs
    char* file_to_open = NULL;
    char** stack = NULL;
    char** temp_stack = NULL;
    char* next_path = NULL;
    char* current_dir = NULL;
    char* base_path = NULL;
    char* temp = NULL;
    int length = 0;
    int check_file_ret = INVALID;
    int check_dir_ret = INVALID;

    stack = malloc(sizeof(char *));

    if(argc != 2)
    {
        printf("Please enter repo dir name, with /trbo at the end.\n");
        return 0;
    }

    printf("Begin operation...\n");


    path = malloc(CONSTRUCT_PATH_LEN(CURRENT_PATH, argv[1], "") + 1);
    if(NULL == path)
    {
        printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
        exit(0);
    }
    snprintf(path, CONSTRUCT_PATH_LEN(CURRENT_PATH, argv[1], "") + 1, "%s%s", CURRENT_PATH, argv[1]);

    init_regex();

    // Push string into stack
    // Initially, stack_top = 0
    // stack[stack_top++] means stack[0]
    // Then, increase stack_top by 1
    stack[stack_top++] = strdup(path);

    // No need anymore, set to point to NULL
    free(path);
    path = NULL;
    
    // Begin traversing directory
    while (stack_top > 0)
    {
        // Get the latest directory from stack
        // Pop the stack. In actuality, when you pop a stack, it just take the toppest index
        // The value is still in the stack. That's how it works
        // Later if you push a new value to stack, it will overwrite the value on that index
        current_dir = stack[--stack_top];

        // Get the base path
        // Let's say A dir has 10 subdirs
        // base_path holds path until A dir only
        // So that later snprintf, it able to append all 10 subdirs to path, and store into stack
        base_path = current_dir;

        dp = open_dir(dp, current_dir);
        if(NULL == dp)
        {
            printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
            exit(0);
        }

        // From the directory, read all dirs/files, store them into 'ep'
        while ((ep = readdir (dp)) != NULL)
        {
            check_file_ret = INVALID;
            check_dir_ret = INVALID;

            check_dir_ret = check_dir(ep, current_dir);

            if(SKIP == check_dir_ret)
                continue;
            else if(IS_FILE == check_dir_ret)
            {
                check_file_ret = check_file(ep, current_dir);

                if(SKIP == check_file_ret)
                    continue;

                // Is valid file to append log, construct the path
                length = strlen(current_dir) + strlen("/") + strlen(ep->d_name);
                file_to_open = malloc(length + 1);
                if(NULL == file_to_open)
                {
                    printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                    exit(0);
                }
                snprintf(file_to_open, length + 1, "%s%s%s", base_path, "/", ep->d_name);

                read_line(file_to_open);
            }
            else if(IS_DIR == check_dir_ret)
            {
                if(0 == check_git_ignore(ep, current_dir))
                    continue;

                // Realloc handling, it uses the next_path's allocation, and add more memory blocks
                temp = realloc(next_path, CONSTRUCT_PATH_LEN(base_path, "/", ep->d_name) + 1);

                // This is to handle check if realloc is fail
                if(NULL == temp)
                {
                    printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                    exit(0);
                }
                // If no fail, proceed to let next_path to point to the new realloc
                // Now both next_path & temp are pointing to the new realloc
                // Then, dont free 'temp', if you free 'temp', it will free 'next_path' as well
                // Only set 'temp' to point to NULL
                next_path = temp;
                temp = NULL;

                // Construct next path to the next subdirectory
                snprintf(next_path, CONSTRUCT_PATH_LEN(base_path, "/", ep->d_name) + 1, "%s%s%s", base_path, "/", ep->d_name);

                // Check if stack is full
                if (stack_top == stack_size) 
                {
                    // If it is, double the size
                    // This is called 'Geometric expansion'
                    // Where doubling the size, is more performance optimized just by increasing size by 1
                    // realloc isn't simple process u know...
                    stack_size *= 2;

                    temp_stack = realloc(stack, stack_size * sizeof(char *));
                    if(NULL == temp_stack)
                    {
                        printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
                        exit(0);
                    }
                    stack = temp_stack;
                    temp_stack = NULL;
                }
                // Push new string into index.
                // It will overwrite whatever value is in the index
                // The design is that, if dir A has 10 subdirs
                // Then push all 10 subdirs into stack
                // Then will closedir on dir A
                // Then will opendir on the 10 subdirs one by one
                // This is iteration approach to open dir recursively
                stack[stack_top++] = strdup(next_path);
            }

            // cleanup / reset
            if(NULL != temp)
                free(temp);
            temp = NULL;
            if(NULL != temp_stack)
                free(temp_stack);
            temp_stack = NULL;
            if(NULL != file_to_open)
                free(file_to_open);
            file_to_open = NULL;
            if(NULL!= next_path)
                free(next_path);
            next_path = NULL;
            length = 0;

        }

        // cleanup / reset
        closedir(dp);
        dp = NULL;
        free(next_path);
        next_path = NULL;
        free(current_dir);
        current_dir = NULL;
        // free(base_path); // no need, base_path is pointing to current_dir, u ady freed current_dir
        base_path = NULL;
    }

    // cleanup
    if(NULL != ep)
        free(ep);
    ep = NULL;
    if(NULL != dp)
        (void) closedir (dp);
    dp = NULL;
    if(NULL != path)
        free(path);
    path = NULL;
    if(NULL != file_to_open)
        free(file_to_open);
    file_to_open = NULL;
    if(NULL != stack)
        free(stack);
    stack = NULL;

    printf("Operation finished\n");
    return 0;
}
typedef struct 
{
    int x;
} haha_t;
