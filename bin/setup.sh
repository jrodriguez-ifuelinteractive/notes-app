#/bin/bash

CWD=`pwd`

# Compile node modules against electron
$CWD/node_modules/.bin/electron-rebuild

# Symlink SQLITE binary
ln -sf $CWD/node_modules/sqlite3/lib/binding/electron-v0.36-darwin-x64 $CWD/node_modules/sqlite3/lib/binding/node-v47-darwin-x64
