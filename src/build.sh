#!/bin/sh
KMODULES="helper util \$ dom format anim test"
cat komunalne.init.js > komunalne.dev.js

for M in $KMODULES
do
  echo "" >> komunalne.dev.js
  cat komunalne.$M.js >> komunalne.dev.js
done
