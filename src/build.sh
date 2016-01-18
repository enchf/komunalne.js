#!/bin/sh
cd $1
mods="$(find . -name "*.js" ! -name "*init*" ! -name "*all*")"
cat komunalne.init.js > komunalne.all.js

for m in $mods
do
  m="${m#*/}"
  echo "" >> komunalne.all.js
  cat $m >> komunalne.all.js
done
