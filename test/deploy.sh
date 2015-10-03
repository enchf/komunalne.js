#!/bin/sh
# Path is obtained from the single-line text file "test.target".
path="$(cat test.target)"

echo "Copying Unit test files to $path"

cp "../src/komunalne.dev.js" $path
cp "index.html" $path
cp "komunalne.test.js" $path
