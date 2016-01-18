#!/bin/sh
v="all"
l="dist"
m=""
path="$(cat test.target)"

if [ $# -ge 1 -a "$1" != "all" ]
  then v=$1;
  else
    v=""
    for i in $(ls -d */); do v="$v ${i%/*}"; done
fi
if [ $# -ge 2 -a "$2" = "dev" ]
  then l="src"
fi
if [ $# -eq 3 -a "$3" = "min" ]
  then m=".min"
fi

for i in $v
do
  p="$path/$i"
  if [ ! -d $p ]; then mkdir $p; fi
  cd $i
  cp index.html $p
  cp komunalne.tests.js $p
  cd ../../$l/$i
  if [ $l = "src" ]; then sh build.sh; fi
  cp komunalne.all$m.js $p/komunalne.js
done
