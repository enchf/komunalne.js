#!/bin/sh
# Path is obtained from the single-line text file "test.target".
path="$(cat test.target)"
cd ../src
sh build.sh
cp komunalne.dev.js $path
cd ../test
cp index.html $path
cp komunalne.tests.js $path
