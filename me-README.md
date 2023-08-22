# How to
1. `npm install`, this will search for `package.json` and install all the required dependencies
2. if you need to install new library and let it fix package.json, run `npm install [library] --save`
3. next thing when you run `git st` you will see `package.json` has changes

# In case of error
1. you want to `git reset` and test whether old commits still work
2. `sudo git reset --hard <commit>`
3. `sudo git clean -xdf`
4. `sudo npm install`
5. Relaod VS code
6. Repeat step 5 until solved.

# Info
1. if you still get `cannot find module` error after installing libraries thru `npm install`
2. try change `ES2020` to `ESNext`, under `lib`, in the file `tsconfig.json`, reload vscode
