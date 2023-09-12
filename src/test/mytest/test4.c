
int main (int argc, char* argv[])
{
//     DIR* dp = NULL; // maybe is Directory Pointer, to open directory
//     struct dirent* ep; // maybe is Directory Entry Pointer, to store detail of directory
//     char* path = NULL; // the path to repo/dir that contains source file to append logs
//     char* file_to_open = NULL;
//     char** stack = NULL;
//     char** temp_stack = NULL;
//     char* next_path = NULL;
//     char* current_dir = NULL;
//     char* base_path = NULL;
//     char* temp = NULL;
//     int length = 0;
//     int check_file_ret = INVALID;
//     int check_dir_ret = INVALID;

//     stack = malloc(sizeof(char *));

//     if(argc != 2)
//     {
//         printf("Please enter repo dir name, with /trbo at the end.\n");
//         return 0;
//     }

//     printf("Begin operation...\n");


//     path = malloc(CONSTRUCT_PATH_LEN(CURRENT_PATH, argv[1], "") + 1);
//     if(NULL == path)
//     {
//         printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
//         exit(0);
//     }
//     snprintf(path, CONSTRUCT_PATH_LEN(CURRENT_PATH, argv[1], "") + 1, "%s%s", CURRENT_PATH, argv[1]);

//     init_regex();

//     // Push string into stack
//     // Initially, stack_top = 0
//     // stack[stack_top++] means stack[0]
//     // Then, increase stack_top by 1
//     stack[stack_top++] = strdup(path);

//     // No need anymore, set to point to NULL
//     free(path);
//     path = NULL;
    
//     // Begin traversing directory
//     while (stack_top > 0)
//     {
//         // Get the latest directory from stack
//         // Pop the stack. In actuality, when you pop a stack, it just take the toppest index
//         // The value is still in the stack. That's how it works
//         // Later if you push a new value to stack, it will overwrite the value on that index
//         current_dir = stack[--stack_top];

//         // Get the base path
//         // Let's say A dir has 10 subdirs
//         // base_path holds path until A dir only
//         // So that later snprintf, it able to append all 10 subdirs to path, and store into stack
//         base_path = current_dir;

//         dp = open_dir(dp, current_dir);
//         if(NULL == dp)
//         {
//             printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
//             exit(0);
//         }

//         // From the directory, read all dirs/files, store them into 'ep'
//         while ((ep = readdir (dp)) != NULL)
//         {
//             check_file_ret = INVALID;
//             check_dir_ret = INVALID;

//             check_dir_ret = check_dir(ep, current_dir);

//             if(SKIP == check_dir_ret)
//                 continue;
//             else if(IS_FILE == check_dir_ret)
//             {
//                 check_file_ret = check_file(ep, current_dir);

//                 if(SKIP == check_file_ret)
//                     continue;

//                 // Is valid file to append log, construct the path
//                 length = strlen(current_dir) + strlen("/") + strlen(ep->d_name);
//                 file_to_open = malloc(length + 1);
//                 if(NULL == file_to_open)
//                 {
//                     printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
//                     exit(0);
//                 }
//                 snprintf(file_to_open, length + 1, "%s%s%s", base_path, "/", ep->d_name);

//                 read_line(file_to_open);
//             }
//             else if(IS_DIR == check_dir_ret)
//             {
//                 if(0 == check_git_ignore(ep, current_dir))
//                     continue;

//                 // Realloc handling, it uses the next_path's allocation, and add more memory blocks
//                 temp = realloc(next_path, CONSTRUCT_PATH_LEN(base_path, "/", ep->d_name) + 1);

//                 // This is to handle check if realloc is fail
//                 if(NULL == temp)
//                 {
//                     printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
//                     exit(0);
//                 }
//                 // If no fail, proceed to let next_path to point to the new realloc
//                 // Now both next_path & temp are pointing to the new realloc
//                 // Then, dont free 'temp', if you free 'temp', it will free 'next_path' as well
//                 // Only set 'temp' to point to NULL
//                 next_path = temp;
//                 temp = NULL;

//                 // Construct next path to the next subdirectory
//                 snprintf(next_path, CONSTRUCT_PATH_LEN(base_path, "/", ep->d_name) + 1, "%s%s%s", base_path, "/", ep->d_name);

//                 // Check if stack is full
//                 if (stack_top == stack_size) 
//                 {
//                     // If it is, double the size
//                     // This is called 'Geometric expansion'
//                     // Where doubling the size, is more performance optimized just by increasing size by 1
//                     // realloc isn't simple process u know...
//                     stack_size *= 2;

//                     temp_stack = realloc(stack, stack_size * sizeof(char *));
//                     if(NULL == temp_stack)
//                     {
//                         printf("%s:%d Terminate\n", __FUNCTION__, __LINE__);
//                         exit(0);
//                     }
//                     stack = temp_stack;
//                     temp_stack = NULL;
//                 }
//                 // Push new string into index.
//                 // It will overwrite whatever value is in the index
//                 // The design is that, if dir A has 10 subdirs
//                 // Then push all 10 subdirs into stack
//                 // Then will closedir on dir A
//                 // Then will opendir on the 10 subdirs one by one
//                 // This is iteration approach to open dir recursively
//                 stack[stack_top++] = strdup(next_path);
//             }

//             // cleanup / reset
//             if(NULL != temp)
//                 free(temp);
//             temp = NULL;
//             if(NULL != temp_stack)
//                 free(temp_stack);
//             temp_stack = NULL;
//             if(NULL != file_to_open)
//                 free(file_to_open);
//             file_to_open = NULL;
//             if(NULL!= next_path)
//                 free(next_path);
//             next_path = NULL;
//             length = 0;

//         }

//         // cleanup / reset
//         closedir(dp);
//         dp = NULL;
//         free(next_path);
//         next_path = NULL;
//         free(current_dir);
//         current_dir = NULL;
//         // free(base_path); // no need, base_path is pointing to current_dir, u ady freed current_dir
//         base_path = NULL;
//     }

//     // cleanup
//     if(NULL != ep)
//         free(ep);
//     ep = NULL;
//     if(NULL != dp)
//         (void) closedir (dp);
//     dp = NULL;
//     if(NULL != path)
//         free(path);
//     path = NULL;
//     if(NULL != file_to_open)
//         free(file_to_open);
//     file_to_open = NULL;
//     if(NULL != stack)
//         free(stack);
//     stack = NULL;

//     printf("Operation finished\n");
//     return 0;
// }