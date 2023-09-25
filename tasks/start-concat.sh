#!/bin/bash

dir=src-todo-concat
targetDir=docs/todo-concat

if [ -d "$targetDir" ]; then
  rm -rf $targetDir
fi

mkdir -p $targetDir/js $targetDir/css $targetDir/js/lib

cd ./$dir/ && cp --parents `find . -name '*.js' -o -name '*.html' -o -name '*.css'` ../$targetDir && cd ..
cp ./src/mpa.js ./$targetDir/js/lib/mpa.js
cp ./node_modules/todomvc-app-css/index.css ./$targetDir/css/index.css && cp ./node_modules/todomvc-common/base.css ./$targetDir/css/base.css

npx esbuild --format=esm --watch --outdir=$targetDir --bundle --servedir=$targetDir ./$dir/sw.ts

