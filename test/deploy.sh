#!/bin/sh
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
if [ $# -eq 3 -a "$3" = "min" -a "$2" = "dist" ]
  then m=".min"
fi

for i in $v
do
  p="$path/$i"
  if [ ! -d $p ]; then mkdir $p; fi
  cd $i
  cp index.html $p
  cp komunalne.tests.js $p
  cd ../../$l
  if [ $l = "src" ]; then sh build.sh $i; fi
  cd $i
  cp komunalne.all$m.js $p/komunalne.js
done
